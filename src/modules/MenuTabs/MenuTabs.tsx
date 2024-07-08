import { Tab, Tabs } from '@nextui-org/react'
import RatingTab from './RatingTab'
import { memo } from 'react'
import ChatTab from './ChatTab'

const MenuTabs = () => {
  const menuList = [
    {
      title: 'Trò chuyện',
      body: <ChatTab />
    },
    {
      title: 'Đánh giá',
      body: <RatingTab />
    }
  ]
  return (
    <div>
      <Tabs
        variant='underlined'
        aria-label='Tabs Menu'
        classNames={{
          base: '1',
          cursor: '8  bg-primary-yellow w-full',
          panel: '2',
          tab: '4 px-0 py-2',
          tabContent: '5 text-primary-base group-data-[selected=true]:text-primary-yellow font-bold',
          tabList: '6 p-0 gap-4',
          wrapper: '7'
        }}
      >
        {menuList.map((item, index) => (
          <Tab title={item.title} key={index}>
            {item.body}
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default memo(MenuTabs)
