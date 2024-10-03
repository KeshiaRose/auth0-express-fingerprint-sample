/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */

exports.onExecutePostLogin = async (event, api) => {
  const {
    FingerprintJsServerApiClient,
    Region,
  } = require("@fingerprintjs/fingerprintjs-pro-server-api");

  const client = new FingerprintJsServerApiClient({
    region: Region.Global,
    apiKey: event.secrets.FINGERPRINT_SECRET_API_KEY,
  });

  // Extract the visitorId and requestId from the query parameters
  const { visitorId, requestId } = event.request.query;
  if (!visitorId || !requestId) return;

  // Fetch the identification event using the requestId
  const identificationEvent = await client.getEvent(requestId);
  const eventVisitorId =
    identificationEvent?.products?.identification?.data?.visitorId;

  // Confirm the visitorId is the same as the one in the identification event
  if (!eventVisitorId || visitorId !== eventVisitorId) {
    api.access.deny(
      "Visitor ID does not match the identification event. Potential spoofing attempt."
    );
  }

  // Check if a bot was detected
  const botDetection = identificationEvent.products?.botd?.data?.bot?.result;

  // If a bot is detected, deny the login
  if (botDetection !== "notDetected") {
    api.access.deny("Login denied due to bot detection.");
  }

  /**
   * You can add additional security checks here
   * to ensure the visitorId is not tampered with
   */

  const metadata = event.user.app_metadata || {};

  // Check if the visitorId is already associated with the user
  if (!metadata.visitorIds || !metadata.visitorIds.includes(visitorId)) {
    console.log("MFA!");
    // If the visitorId is not recognized, trigger MFA
    api.multifactor.enable("any");
  }

  // If the MFA is successful, associate the visitor ID with the user
  let updatedVisitorIds = metadata.visitorIds || [];
  if (!updatedVisitorIds.includes(visitorId)) {
    updatedVisitorIds.push(visitorId);

    // Update the app_metadata with the new visitorId after successful MFA
    api.user.setAppMetadata("visitorIds", updatedVisitorIds);
    console.log("Visitor ID added to the list: ", updatedVisitorIds);
  }

  // Set the visitorIds as a custom claim so it can be accessed in the app
  api.idToken.setCustomClaim("visitorIds", updatedVisitorIds);
};
