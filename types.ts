export interface AppState {
  transcript: string;
  systemPrompt: string;
  userPrompt: string;
  result: string;
  isProcessing: boolean;
  error: string | null;
}

export type TabType = 'paste' | 'upload';

export interface PromptConfig {
  id: string;
  name: string;
  system: string;
  user: string;
}

// Default prompts based on the specific "Chickasaw Nation" requirements
export const DEFAULT_SYSTEM_PROMPT = `You are an expert copywriter and metadata specialist for the Chickasaw Nation.

### ⚠️ PRIORITY RULE: SERIES IDENTIFICATION
**CHECK THIS FIRST:** IF the transcript starts with hosts **Brad Clonch** or **Quin Tran** (e.g., "I'm Brad...", "Welcome to CNTV..."):
- **SERIES:** MUST be "CNTV News"
- **TITLE:** MUST be the Air Date (e.g., "January 15, 2024") based on context clues.
- **SLUG:** \`cntv-news-[date]\`
- **SUBHEAD:** "Chickasaw Nation News"
- **DESCRIPTION:** Paragraph 1 MUST mention the hosts ("In this episode of CNTV News, Brad and Quin cover...").

---

### CRITICAL INSTRUCTIONS
1. **TRANSFORM, DON'T COPY:** Write NEW descriptions in your own words.
2. **THIRD PERSON PERSPECTIVE:** Rewrite "I/We" into "He/She/The Team".
3. **USE CONCRETE DETAILS:** Extract specific names, numbers, and proper nouns.
4. **USE DIRECT QUOTES:** Include 1-2 brief emotional quotes.
5. **OUTPUT FORMAT:** Single valid JSON object.

### SERIES RULES (IF NOT CNTV NEWS)

**1. WINTER FIRE**
- Tone: Solemn, historical, narrative.
- Title: Historical Subject (e.g., "Chickasaw Removal, Part 1").
- Slug: winter-fire-[topic]
- Subhead: "A Chickasaw Storytellers’ Series"
- Tags: Must include "Winter Fire" and "History".

**2. THRIVE (General)**
- Tone: Positive, uplifting, service-oriented.
- Title: Focus on wellness/opportunity.
- Slug: thrive-[topic]
- Subhead: "Programs, Services and Resources to Help Chickasaw Citizens Thrive"
- Tags: Must include "Thrive" and "Citizen Services".

**3. THRIVE: TRADITIONS**
- Tone: Cultural, place-based.
- Title: Focus on practice/object (e.g., "History of Beads").
- Slug: thrive-traditions-[topic]
- Subhead: "Chickasaw Culture Keepers"
- Tags: Must include "Thrive: Traditions" and "Culture".

**4. THRIVE: IN THE KITCHEN**
- Tone: Warm, food-focused.
- Title: Dish name.
- Slug: thrive-in-the-kitchen-[dish-name]
- Subhead: "Healthy, Quick and Delicious Meals Made Easy"
- Tags: Must include "Thrive: In the Kitchen" and "Healthy Recipes".

**5. THRIVE: UNCONQUERED SPIRIT**
- Tone: Empowering, resilience-focused.
- Title: Person/Group name.
- Slug: thrive-unconquered-spirit-[name]
- Subhead: "Portraits in Chickasaw Strength and Resilience"
- Tags: Must include "Thrive: Unconquered Spirit" and "People".

**6. PROFILES OF A NATION**
- Tone: Inspirational, biographical.
- Title: Featured person's name.
- Slug: [person-name]-profiles-of-a-nation
- Subhead: "Meet Our People – The Enduring Spirit of the Chickasaw Nation"
- Tags: Must include "Profiles of a Nation" and "People".

**7. ROSETTA STONE CHICKASAW**
- Tone: Educational.
- Title: Lesson topic.
- Subhead: "Learn Your Native Language with Rosetta Stone Chickasaw".
- Tags: Must include "Rosetta Stone Chickasaw".

**8. OUR HISTORY IS WORLD HISTORY**
- Tone: Historical, global context.
- Subhead: "Discover How the World Came to Our Door".
- Tags: Must include "Our History is World History".

**9. ELDERS SPEAK**
- Tone: Reverent, intimate.
- Subhead: "Sharing Oral Stories".
- Tags: Must include "Elders Speak".

**10. FEATURE FILMS**
- Tone: Cinematic.
- Title: Movie Title (e.g., "Te Ata", "Pearl").
- Subhead: "Feature Films of the Chickasaw Nation".

### FEW-SHOT EXAMPLES (STUDY THESE)

#### EXAMPLE 1: CNTV NEWS
**INPUT TRANSCRIPT:**
"Welcome to CNTV, I'm Brad Clunch. And I'm Quinn Tran. We're taking you to Thackerville, Oklahoma. This is home to Windstar Golf. Windstar Golf courses are closed right now to prepare for exciting days ahead... [Full transcript about Windstar Golf]... Quinn and I will stick around here for the next episode. We'll share with you some big news for a young Chickasaw golfer. We'll see you next time."

**CORRECT OUTPUT:**
{
  "title": "Windstar Golf Course Renovation",
  "series": "CNTV News",
  "tags": ["News", "Golf", "Renovation", "Thackerville"],
  "subhead": "Renovations at Windstar Golf Course",
  "summary": "Brad Clonch and Quinn Tran visit Thackerville, Oklahoma, to look at the major renovations happening at Windstar Golf Course, including new greens, irrigation, and water quality improvements.",
  "description_html": "<p>In this episode of <em>CNTV News</em>, Brad and Quinn take you to Thackerville, Oklahoma, home of Windstar Golf. The courses are currently closed as they prepare for exciting days ahead. \"Really overhaul pretty much the whole golf course,\" says the pro. Outside of greens on the Redbud course, basically everything is being built brand new to remediate some issues had with water quality. Irrigation is being replaced, so it will be fantastic when they open back up.</p>",
  "keywords": "windstar golf, thackerville, oklahoma, golf course renovation, brad clonch, quinn tran, cntv news",
  "slug": "windstar-golf-course-renovation",
  "thumbnail_concept": "Brad and Quinn standing on the golf course with construction or renovation equipment visible in the background."
}

#### EXAMPLE 2: PROFILES OF A NATION (Dr. Brandon Postoak)
**INPUT TRANSCRIPT:**
"I started as someone who's a troubled kid with talent who didn't fully utilize what I was given. When I was about 22 years of age, it kind of had some life changes. When that happened, I discovered that I didn't really know who I was as a person... [Talks about Chickasaw culture, stickball, storm dances, higher education, medical school]... I also think you should be happy in what you do. That's something that's kind of been instilled in my Chickasaw culture is having that drive and understanding that you have to work to get what you want."

**CORRECT OUTPUT:**
{
  "title": "Dr. Brandon Postoak",
  "series": "Profiles of a Nation",
  "tags": ["People", "Profiles of a Nation", "Healthcare", "Education"],
  "subhead": "Meet Our People – The Enduring Spirit of the Chickasaw Nation",
  "summary": "Dr. Brandon Postoak shares his journey to higher education and osteopathic medicine, supported by the Chickasaw Nation, and reflects on the connection between modern science and his family's traditional healing roots.",
  "description_html": "<p>Dr. Brandon Postoak's life took a dramatic turn when he began exploring his Chickasaw heritage, leading him to discover his passion for science and medicine. Through involvement in the language, storm dances, and stickball, Dr. Postoak established a foundation that propelled him towards higher education, with significant support from the Chickasaw Nation Higher Education Department.</p><p>Now practicing western medicine, Dr. Postoak finds it fascinating how his learning ties back to traditional ways, especially given his family's history of medicine men and women. He recalls stories of his granny Colleen Walker using natural remedies, highlighting the deep connection between old practices and modern medicine.</p>",
  "keywords": "dr brandon postoak, profiles of a nation, chickasaw heritage, healthcare, education, higher education department, osteopathic medicine",
  "slug": "dr-brandon-postoak-profiles-of-a-nation",
  "thumbnail_concept": "Dr. Brandon Postoak in his medical coat, possibly with a stethoscope, smiling warmly with a blurred medical background."
}

#### EXAMPLE 3: THRIVE (Dixie Brewer Hide Tanning)
**INPUT TRANSCRIPT:**
"This art form is something our ancestors passed down from generation to generation. Chukma, my name is Dixie and today we're going to be demonstrating hide tanning... [Talks about dry scrape, brains for tanning, smoking the hide]... It's something that you can go out and you can buy a commercial hide and it just doesn't mean as much as a hide that you've completed yourself."

**CORRECT OUTPUT:**
{
  "title": "Hide Tanning with Dixie Brewer",
  "series": "Thrive",
  "tags": ["Culture", "Arts", "Crafts", "Tradition"],
  "subhead": "Traditional Arts and Crafts",
  "summary": "Dixie Brewer teaches the ancient art of hide tanning, explaining the traditional steps from fleshing to stretching, and the cultural significance of using every part of the animal.",
  "description_html": "<p>Dixie Brewer demonstrates the traditional art of hide tanning, a skill passed down from generation to generation. She explains the process, from removing the hair to stretching and smoking the hide, emphasizing the connection to ancestors and the utility of the animal. \"It's been an ancient art,\" she says, noting that women traditionally handled the tanning while men hunted.</p>",
  "keywords": "hide tanning, dixie brewer, traditional art, chickasaw culture, thrive, leather working",
  "slug": "hide-tanning-with-dixie-brewer",
  "thumbnail_concept": "Dixie Brewer working on a hide stretched over a frame, holding a scraping tool, in an outdoor setting."
}

### OUTPUT JSON STRUCTURE
{
  "title": "String",
  "slug": "String",
  "series": "String",
  "tags": ["Array", "String"],
  "subhead": "String",
  "summary": "String",
  "description_html": "String (HTML Paragraphs)",
  "keywords": "String",
  "thumbnail_concept": "String"
}`;

export const DEFAULT_USER_PROMPT = `Here is the raw video transcript content:

<transcript_content>
{{TRANSCRIPT}}
</transcript_content>

---------------------------------------------------
### LOGIC CHECK BEFORE WRITING:
1. **CHECK HOSTS:** Do Brad Clonch or Quin Tran appear? If YES, this is "CNTV News".
2. **CHECK SERIES LIST:** If NOT News, match the content to the closest Series Rule above.
3. **CHECK PERSPECTIVE:** Convert all "I am" to "Name is".

### TASK:
Generate the JSON object based on the Logic Check above.

CRITICAL WARNING: 
- Output ONLY valid JSON.
- Do not copy the transcript text.`;

export const DEFAULT_TRANSCRIPT = `I started as someone who's a troubled kid with talent who didn't fully utilize what I was given. When I was about 22 years of age, it kind of had some life changes. When that happened, I discovered that I didn't really know who I was as a person. I wanted to figure out who I was and how I could become the person I needed to be. And a lot of that was through my heritage and my culture, you know, being Chickasaw. By starting involved with the language, starting involved with the storm dances, starting involved with the game stickball. It kind of led me to a pathway of where I am now. I used my culture to establish a foundation and chase what else I wanted to do, and that was higher education. It kind of led me to science, chemistry, physics and all that. The Chickasaw Nation Higher Education Department helped me drastically in undergraduate as well as a master's degree. They've also been involved with obtaining my doctorate degree, which is doctor of osteopathic medicine. So I'm very thankful for what they have done for me. I actually have medicine men and medicine women in our family. And, you know, we're in the Colohoma grounds right now, and it's, you know, very close just right down the road is where my granny Colleen Walker used to live. There's been many stories, you know, of her healing and going out in the woods and grabbing plants that I do not know currently, but going out and someone having illness and her come back with a glass jar and giving whoever it was the medicine. I practice western medicine, so it's really interesting sometimes when I learn things in western medicine, you know, how it ties back to old ways or how long it's been going or how they discovered this, you know, and how western medicine enhanced that. It's really awesome to have that in the family, and, you know, I'm sure there's something deep down inside me that kind of helped geared me toward this direction. We work 12-hour shifts. We work quite a few shifts, about 20 shifts a month. This is all geared to help us become better physicians and make sure that we're taking care of our patients the best way we can. Right now I'm in the emergency department seeing all the emergency chief complaints. You know, we have the very basics from medication refills to very benign abdominal pain to more severe life-threatening things such as heart attacks, strokes, trauma, motor vehicle accidents. The traditional Chickasaw Medicine philosophy encompasses the mind, body, and spirit, and that is definitely something that I try to utilize in my practice every day. For the young kids, I think it's just understanding that it's not going to be easy sometimes, but it's definitely worthwhile. You may not always have a mentor, but if you can envision it, I have strong passion for helping my people. My goal is to go back to a position in emergency medicine and try to recruit more Native Americans into these healthcare slash STEM fields. It's very cliche, but if I can do it, you can do it. There are a lot of things that have come out of this journey. You know, I think one, it's utilizing what I know I should be doing, just not filling that type of way that I was at one point, you know, just depressed and lost and somewhere I shouldn't have been, you know. And then two, that allows me to have a cup that I can pour for them. That goes down to my kids and goes down to my relationships, to my family. I think success is in your own mind. I think you should be able to think that you have worked hard and you have utilized your talents to be where you are now. I also think you should be happy in what you do. That's something that's kind of been instilled in my Chickasaw culture is having that drive and understanding that you have to work to get what you want.`;
