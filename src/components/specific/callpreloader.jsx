import React, { useEffect, useState } from "react";
import { Cover } from "../ui/cover";
import { generateresponse } from "../../libs/features";


export function CoverDemo() {
  const [fact,setfact]=useState("Wait... Bringing You Some New");
  const [cover,setcover]=useState("Fact")
  const generateaihelp = async () => {
    const prompt = `Generate one engaging and well-researched fact about the latest trends, surveys, or statistics related to technology, communication, or video calls. The fact should be concise, 7-8 words, and formatted as follows:
[Introductory and detailed context] | [Highlight text]
The content before the | should provide context or supporting details, while the text after the | should emphasize the most exciting or surprising takeaway in 2-3 words. Examples:
Video calls now account for 70% of workplace communication, reducing the need for travel and fostering real-time collaboration. | Driving global teamwork
Over 50% of users prefer platforms with AI noise cancellation, enhancing the experience of virtual meetings. | Noise-free innovation
Focus on delivering an insightful and compelling fact with a clear and impactful crux.`;
    const response = await generateresponse(prompt);
    console.log(response)
    const [newfact,newcover]=response.split("|")
    setfact(newfact)
    setcover(newcover)
  };

  useEffect(()=>{
    if(cover==="Fact" && fact==="Wait... Bringing You Some New")
        generateaihelp();
  })
  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white bg-black">
      {`${fact}` }
      <br/>
      <Cover>{`${cover}`}</Cover>
      </h1>
    </div>
  );
}
