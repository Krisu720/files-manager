import { Share } from 'lucide-react'
import { FC } from 'react'

interface FooterProps {
  
}

const Footer: FC<FooterProps> = ({}) => {
  return <div className='h-20 border-t py-4 mt-4'>
    <div className='container flex sm:flex-row flex-col justify-between items-center h-full'>
    <h1 className='text-xl flex gap-1 items-center'><Share className='h-5 w-5 text-primary'/>Files Manager </h1>
    <h1>Created by <a href='https://github.com/Krisu720' target='_blank' className='underline-offset-4 underline'>Krzysztof Wilk</a></h1>
    </div>
  </div>
}

export default Footer