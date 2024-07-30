import FooterInput from '@/modules/FooterInput/FooterInput'
import Header from '@/modules/Header/Header'
import MenuTabs from '@/modules/MenuTabs/MenuTabs'

const HomePage = () => {
  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Header />
      <div className={`flex flex-1 flex-col gap-2 overflow-auto py-4`}>conversation</div>
      <FooterInput />
    </div>
  )
}

export default HomePage
