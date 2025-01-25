import React, { useEffect, useState } from "react";
import { Cover } from "../ui/cover";
import { generateresponse } from "../../libs/features";
import { motion } from "framer-motion";

export function CoverDemo() {
  const [fact, setfact] = useState("Wait... Don't Get Bored Read The Upcoming");
  const [cover, setcover] = useState("News");
  const generateaihelp = async () => {
    const prompt = `Generate one engaging and well-researched fact about the latest of Recent surveys.News can be from indian automotive, Indian Tech Industry,Indian Telecommunication Industry, Income Tax etc . Include News of current year and last year i.e 2025 and 2024 and 2023 .The News Should be catchy. The News should be concise, 12-15 words, and formatted as follows:
[Introductory and detailed context] | [Highlight text]
The content before the | should provide context or supporting details, while the text after the | should emphasize the most exciting or surprising takeaway in 5-6 words.This should be like make the news rock like a gen -z talks.Like This 5-6 Words can of like . Iff A company is favoured in news than this can be like A rock every one shock . Add this type of Gen-Z comments.Do add Relavant Emoji's which make this more crazy and eye catchy.Do revolve Around Every Tech News  
You can add as crazy emoji that make this attractive . 
Video calls now account for 70% of workplace communication, reducing the need for travel and fostering real-time collaboration. | Driving global teamwork
Over 50% of users prefer platforms with AI noise cancellation, enhancing the experience of virtual meetings. | Noise-free innovation
Focus on delivering an insightful and compelling fact with a clear and impactful crux.

`;
    const response = await generateresponse(prompt);

    const [newfact, newcover] = response.split("|");
    setfact(newfact);
    setcover(newcover);
  };

  useEffect(() => {
    if (
      cover === "News" &&
      fact === "Wait... Don't Get Bored Read The Upcoming"
    )
      generateaihelp();
  });
  return (
    <motion.div
      initial={{
        x: "-50%",
        opacity: 0.5,
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width:"100%",
        height: "100%",
        position: "absolute",
        
      }}
    >
      <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-gray-300 bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white bg-black">
        {`${fact}`}
        <br />
        <Cover>{`${cover}`}</Cover>
      </h1>
    </motion.div>
  );
}
