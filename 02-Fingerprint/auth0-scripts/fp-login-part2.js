/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Get variables from first Action
  const appMetadata = event.user.app_metadata || {};
  const visitorId = appMetadata.currentVisitorId;
  const mfaNeeded = appMetadata.mfaNeeded;
  api.user.setAppMetadata("currentVisitorId", null);
  api.user.setAppMetadata("mfaNeeded", null);

  // If no visitorId has been passed there is an error
  if (!visitorId) return api.access.deny("Visitor identification not found.");

  // Check if the user successfully completed authentication and MFA if needed
  if (!event.authentication) return api.access.deny("Failed authentication.");
  const mfaSuccess = event.authentication.methods.find((m) => m.name == "mfa");
  if (mfaNeeded && !mfaSuccess)
    return api.access.deny("Failed multi-factor authentication.");

  // If successfully passed all checks, associate the visitor ID with the user
  let updatedVisitorIds = appMetadata.visitorIds || [];
  if (!updatedVisitorIds.includes(visitorId)) {
    // Update the app_metadata with the new visitorId
    updatedVisitorIds.push(visitorId);
    api.user.setAppMetadata("visitorIds", updatedVisitorIds);
  }

  // Optional: set the visitorIds as a custom claim so it can be accessed from the app
  api.idToken.setCustomClaim("visitorIds", updatedVisitorIds);
};
