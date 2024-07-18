import React, { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

function useAuth() {
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    // Discovery doc URL for APIs used by the quickstart
    const DISCOVERY_DOC =
      "https://sheets.googleapis.com/$discovery/rest?version=v4";

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    let gapiInited = false;
    let gisInited = false;

    // document.getElementById("authorize_button").style.visibility = "hidden";
    // document.getElementById("signout_button").style.visibility = "hidden";

    /**
     * Callback after api.js is loaded.
     */
    function gapiLoaded() {
      gapi.load("client", initializeGapiClient);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function initializeGapiClient() {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      // maybeEnableButtons();
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    async function gisLoaded() {
      setTokenClient(
        await google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: "", // defined later
        })
      );
      gisInited = true;
      // maybeEnableButtons();
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */

    async function init() {
      await gapiLoaded();
      await gisLoaded();
    }

    init();
  }, []);

  /**
   *  Sign in the user upon button click.
   */
  async function handleAuthReq() {
    let token;
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      // document.getElementById("signout_button").style.visibility = "visible";
      // document.getElementById("authorize_button").innerText = "Refresh";
      await listNotes();
    };

    if (!gapi?.client?.getToken) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      token = await tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      token = await tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  return {
    handleAuthReq,
  };
}

export default useAuth;
