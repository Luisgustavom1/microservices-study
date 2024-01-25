import { FaRegularMoneyBill1, FaSolidList } from 'solid-icons/fa'
import { FiArrowDownCircle, FiArrowUpCircle } from 'solid-icons/fi'
import { Item } from './item'

export const Aside = () => {
    return (
      <aside class='min-w-60 bg-gray-light border-r border-r-gray-200 h-screen'>
        <header class='p-6 flex items-center gap-2 mb-4'>
          <FaRegularMoneyBill1 size={20} />
          <h2 class='font-bold'>
            Bank Dashboard
          </h2>
        </header>

        <ul class='grid gap-1 px-4'>
          <Item
            Icon={<FaSolidList size={20} />}
            text='All transactions'
          />
          <Item
            Icon={<FiArrowDownCircle size={20} /> }
            text='Deposit'
          />
          <Item
            Icon={<FiArrowUpCircle size={20} /> }
            text='Withdrawals'
          />
        </ul>
      </aside>
    )
}