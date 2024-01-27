import { Router, Route } from "@solidjs/router";
import { PrivateContainer } from "./container/private.container";
import { Aside } from "./features/aside";
import { Transactions } from "./features/transactions";
import { AddTransaction } from "./features/transactions/add.transaction";
import { Accounts } from "./features/accounts";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" component={Accounts} />
      <Route
        path="/transactions"
        component={(props) => (
          <PrivateContainer
            Aside={() => <Aside />}
            Content={() => props.children}
          />
        )}
      >
        <Route path="/" component={Transactions} />
        <Route path="/add" component={AddTransaction} />
      </Route>
    </Router>
  );
};
