import { Router, Route } from "@solidjs/router";
import { MainContainer } from "./container/main.container";
import { Aside } from "./features/aside";
import { Transactions } from "./features/transactions";
import { AddTransaction } from "./features/transactions/add.transaction";

export const Routes = () => {
  return (
    <MainContainer
      Aside={() => <Aside />}
      Content={() => (
        <Router>
          <Route path="/transactions" component={Transactions} />
          <Route path="/transactions/add" component={AddTransaction} />
        </Router>
      )}
    />
  );
};
