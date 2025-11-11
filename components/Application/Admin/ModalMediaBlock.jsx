
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

const ModalMediaBlock = ({ media, onClick, isSelected }) => {
  return (
    <label
      htmlFor={media._id}
      onClick={onClick}
      className={`border rounded relative group cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="absolute top-2 left-2 z-20">
        <Checkbox checked={isSelected} readOnly />
      </div>

      <div className="relative w-full h-0 pb-[100%]">
        <Image
          src={media.secure_url}
          alt={media._id}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
      </div>
    </label>
  )
}


export default ModalMediaBlock
