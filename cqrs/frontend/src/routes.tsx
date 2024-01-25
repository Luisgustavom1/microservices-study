import { Router, Route } from "@solidjs/router";
import { MainContainer } from "./container/main.container";
import { Aside } from "./features/aside";
import { Transactions } from "./features/transactions";

export const Routes = () => {
  return (
    <MainContainer
      Aside={() => <Aside />}
      Content={() => (
        <Router>
          <Route path="/" component={Transactions} />
        </Router>
      )}
    />
  );
};
