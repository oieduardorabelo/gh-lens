import { useEffect } from "react";
import qs from "query-string";
import { GoMarkGithub } from "react-icons/go";

import { GH_AUTHORIZE_ENDPOINT } from "lib/github-oauth";
import * as client from "lib/netlify-lambda-client";

import { useContainer } from "state/app";

import Authenticated from "ui/compounds/Authenticated";

const App: React.FC = () => {
  const [state, actions] = useContainer();

  useEffect(() => {
    if (state.isAuthenticated) {
      // already authenticated, nothing to do here.
      return;
    }

    async function task() {
      // read code from querySting
      const { code } = qs.parse(window.location.search);

      if (!code || typeof code !== "string") {
        return;
      }

      // reset querySting
      window.history.replaceState({}, "", "/");

      const response = await client.startGithubOauth(code);

      if (response.data.access_token) {
        actions.signIn(response.data.access_token);
      }
    }

    task();
  }, [actions, state.isAuthenticated]);

  return (
    <section className="min-h-screen w-full bg-gray-600 grid place-items-center">
      {state.isAuthenticated ? (
        <Authenticated />
      ) : (
        <a
          href={GH_AUTHORIZE_ENDPOINT}
          className="max-w-xs w-full bg-gray-800 p-4 rounded-md text-white flex items-center justify-center text-lg"
        >
          <GoMarkGithub className="mr-2" />
          Sign in with Github
        </a>
      )}
    </section>
  );
};

export default App;
