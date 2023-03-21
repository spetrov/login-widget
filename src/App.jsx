import "./App.css";
import "@forgerock/login-widget/widget.css";

import Widget, {
  configuration,
  component,
  journey,
  user,
} from "@forgerock/login-widget";
import { useEffect, useState } from "react";

const config = configuration();
config.set({
  forgerock: {
    serverConfig: {
      baseUrl: "https://openam-forgerrock-sdksteanant.forgeblocks.com/am/",
      // baseUrl: "https://openam-cmfa.forgeblocks.com/am/",
      timeout: 3000,
    },
    realmPath: "alpha",
    clientId: "widget-client",
    redirectUri: "https://sdkapp.example.com:8443/",
    scope: "openid profile email address phone",
    tree: "Login",
  },
  content: {
    validatedCreateUsernameCallback: "потребителското име?",
    validatedCreatePasswordCallback: "парола",
    confirmPassword: "парола again",
    userName: "потребителското име?",
    givenName: "как се казваш?",
    passwordCallback: "парола",
    nextButton: "напред",
  },
  style: {
    checksAndRadios: "animated", // OPTIONAL; choices are 'animated' or 'standard'
    labels: "floating", // OPTIONAL; choices are 'floating' or 'stacked'
    logo: {
      // OPTIONAL; only used with modal form factor
      dark: "https://www.comoxvalleymushrooms.com/wp-content/uploads/2019/03/Comox-Valley-Mushrooms-495x400.png", // OPTIONAL; used if theme has a dark variant
      light:
        "https://www.comoxvalleymushrooms.com/wp-content/uploads/2019/03/Comox-Valley-Mushrooms-495x400.png", // REQUIRED if logo property is provided; full URL
      height: 400, // OPTIONAL; number of pixels for providing additional controls to logo display
      width: 600, // OPTIONAL; number of pixels for providing additional controls to logo display
    },
    sections: {
      // OPTIONAL; only used with modal form factor
      header: true, // OPTIONAL; uses a modal "header" section that displays logo
    },
    stage: {
      icon: true, // OPTIONAL; displays generic icons for the provided stages
    },
  },
  links: {
    termsAndConditions: "terms",
    // termsAndConditionsLinkText: "Gu-gu gaa",
  },
});

// new Widget({
//   target: document.getElementById("widget-root"),
// });

const componentEvents = component();
const journeyEvents = journey();
const userEvents = user.info();

const widget = new Widget({
  // Target needs to be an actual DOM element, so ref is needed with inline type
  target: document.getElementById("widget-root"),
  props: { type: "modal" },
});

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    componentEvents.subscribe((event) => {
      console.log("Component event: " + JSON.stringify(event, null, " "));
    });
  }, []);

  useEffect(() => {
    journeyEvents.subscribe((event) => {
      console.log("Journey event: " + JSON.stringify(event, null, " "));
    });
  }, []);

  useEffect(() => {
    userEvents.subscribe((event) => {
      console.log("User event: " + JSON.stringify(event, null, " "));

      if (event.successful) {
        setUserInfo(event.response);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-main">
        <h4>ForgeRock Login Widget :: Modal Demo</h4>
        <hr />
        <div className="card">
          {userInfo ? (
            <>
              <pre>{JSON.stringify(userInfo, null, " ")}</pre>
              <button
                onClick={() => {
                  user.logout();
                  setUserInfo(null);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                componentEvents.open();
                journeyEvents.start();
              }}
            >
              Login
            </button>
          )}
        </div>
        <hr />
      </header>
    </div>
  );
}

export default App;
