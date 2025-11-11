'use client'
import { Card, CardContent } from '@/components/ui/card';
import React, { use, useEffect, useState } from 'react'

import axios from 'axios';

import verifiedIms from '@/public/assets/images/verified.gif'
import faildVarification from '@/public/assets/images/verification-failed.gif'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WEBSITE_HOME } from '@/routes/WebsiteRoute';

const EmailVarification = ({ params }) => {

  const { token } = use(params)

  const [isVarified, setIsvarified] = useState(false)
  console.log(token);

  useEffect(() => {
    const varify = async () => {
      const { data: varificationResponse } = await axios.post('/api/auth/verify-email', { token })
      if (varificationResponse.success) {
        setIsvarified(true)
      }
    }
    varify()
  }, [])

  return (
    <Card className="q-[400]">
      <CardContent>
        {isVarified ? <div className=''>

          <div className="flex justify-center item-center">
            <Image src={verifiedIms} height={verifiedIms.height} width={verifiedIms.width} alt='failed' className='h-[100] w-auto'/>
          </div>
          <div className="text-center">
            <h1 className='text-2xl font-bold my-5'>Email varified</h1>
            <Button asChild>
              <Link href={WEBSITE_HOME}> Continue Shopping  </Link>
            </Button>
          </div>


        </div>
          :
          <div>
            <div className="flex justify-center item-center">
              <Image src={faildVarification} height={faildVarification.height} width={faildVarification.width}  alt='failed'  className='h-[100] w-auto'/>
            </div>
            <div className="text-center">
              <h1 className='text-2xl font-bold my-5'>Email varification failed</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}> Continue Shopping  </Link>
              </Button>
            </div>
          </div>

        }
      </CardContent>
    </Card>
  )
}

export default EmailVarification
