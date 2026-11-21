'use client'
import { useState } from 'react';

import {m} from "framer-motion"
import {TypewriterEffect} from "@/components/ui/TyperWriter";

import {FlipText} from "@/components/ui/FlipText";
import {Button} from "@/components/ui/button";
import WizardingRegistrationModal from '@/components/WizardingRegistrationModal';
import {ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";
import { Cinzel } from "next/font/google";
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600"] });

export default function Hero() {

    const sentence = [{text: "cat",}, {text: "welcome",}, {text: "message.txt",}];
    const router = useRouter()
    const [registerOpen, setRegisterOpen] = useState(false);

    return (
        <div id='Hero'>

            <div className='flex min-h-[calc(100vh-40rem)]  justify-evenly gap-4   overflow-hidden  flex-col w-full '>
                <m.div>
                    <h2 className="mt-[5rem] iphone5:text-[2.3rem] uppercase medium-phone:text-[2.8rem] slighty-large-phone:text-[3.4rem] large-phone:text-6xl  tablet:text-7xl  font-[1000]   text-center text-black dark:text-white  tracking-tight">
                        <FlipText>Welcome</FlipText> <FlipText>to </FlipText>   <br/>

                        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div
                                className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-2">
                                <span>house of Ideas</span>
                            </div>
                        </div>
                    </h2>
                </m.div>
                {/*op 0.1*/}
                <m.div className="text-center mx-auto w-full font-mono text-purple-300 text-lg md:text-xl lg:text-2xl max-w-4xl mt-4 bg-gradient-to-b from-gray-900 to-black px-4 py-6 sm:px-6 rounded-lg shadow-[0_0_15px_rgba(128,0,128,0.1)] border border-purple-900"
                    style={{boxShadow: 'inset 0 1px 3px 0 rgba(128,0,128,0.2), 0 0 15px rgba(128,0,128,0.2)',
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(64,0,64,0.15), rgba(64,0,64,0.15) 1px, transparent 1px, transparent 2px)'
                    }}
                >
                    <div className="flex  items-center justify-between mb-4 border-b border-purple-800 pb-2">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-purple-600  dark:text-purple-400 text-sm">bash</div>
                    </div>
                    <div className="mb-2 text-left flex flex-col tablet:flex-row  items-left">
                        <span className="text-purple-600  dark:text-purple-400 whitespace-nowrap">user@houseofideas:~$&nbsp;</span>
                        <TypewriterEffect className='text-purple-600  dark:text-purple-400' words={sentence}/>
                    </div>
                    <p className="whitespace-pre-line  text-purple-400 dark:text-purple-300 text-left ">
                        Welcome to House Of Ideas at Algiers University 3.We are a club
                        dedicated to teaching through insightful events and engaging workshops.
                        Our mission is to create a space where students
                        can acquire and enhance their skills and become a better version of themselves
                    </p>
                    <p className="mt-2 text-left">
                        <span className="text-purple-600  dark:text-purple-400">user@houseofideas:~$</span>
                    </p>
                </m.div>
                <div className='flex flex-col items-center gap-12 mt-8'>

    {/* Row 1: Workshops + Events side by side */}
    <div className='flex md:gap-12 gap-5 flex-col sm:flex-row justify-center items-center'>
        <Button aria-label='check all workshops' className='bg-gradient-to-r from-purple-700 to-purple-900' onClick={()=>router.push('/Workshops')} size='md' variant='cto'>
            <span className="mr-2 min-w-[13rem]">
                check out all Workshops
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-in-out transform group-hover:translate-x-1"/>
        </Button>

        <Button aria-label='check all events' className='bg-gradient-to-r from-blue-700 to-blue-900' onClick={()=>{router.push('/Events')}} size='md' variant='cto'>
            <span className="mr-2 min-w-[13rem]">
                check out all Events
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-in-out transform group-hover:translate-x-1"/>
        </Button>
    </div>

    {/* Row 2: Hogwarts button, lower and centred */}
 <Button aria-label='check latest events' className='btn-hogwarts relative !rounded-2xl !px-10 !py-2.5 !justify-center' onClick={() => setRegisterOpen(true)} size='md' variant='cto'>
    <span className="flex flex-col items-center justify-center gap-1 w-full text-center">
        <span className="font-bold text-[0.7rem] sm:text-xs tracking-[0.12em] whitespace-nowrap">WELCOME TO HOGWARTS EVENT</span>
        <span className="flex items-center gap-2 text-[#c9a24b] text-[0.6rem] leading-none">
            <span className="h-px w-6 bg-[#c9a24b]" />
            ✦
            <span className="h-px w-6 bg-[#c9a24b]" />
        </span>
        <span className="text-[0.6rem] tracking-[0.25em] text-[#c9a24b]">29 NOVEMBER 2026</span>
    </span>
    <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1"/>
</Button>
    <WizardingRegistrationModal open={registerOpen} onOpenChange={setRegisterOpen} />
</div>
            </div>
        </div>
    )
}