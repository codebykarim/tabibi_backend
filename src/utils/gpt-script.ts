import OpenAI from "openai";
import AppError from "../errors/AppError";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const faq = [
  {
    keywords: [
      "من انت",
      "انت مين",
      "مين انت",
      "انت من",
      "من مين",
      "مين من",
      "من اين",
    ],
    answer: "المساعد الذكي لدكتور علي زيدان",
  },
  {
    keywords: [
      "ساعات عمل الطبيب",
      "ساعات عمل الدكتور",
      "مواعيد الدكتور",
      "ساعات العمل",
      "مواعيد العمل",
      "ساعات الطبيب",
      "مواعيد الطبيب",
      "مواعيد",
      "المواعيد",
      "الساعات",
      "المواعيد العمل",
      "الساعات العمل",
      "المواعيد الطبيب",
      "الساعات الطبيب",
      "المواعيد الدكتور",
      "الساعات الدكتور",
      "المواعيد العمل الطبيب",
      "الساعات العمل الطبيب",
      "المواعيد الدكتور الطبيب",
      "الساعات الدكتور الطبيب",
      "المواعيد العمل الدكتور",
      "الساعات العمل الدكتور",
      "المواعيد الطبيب الدكتور",
      "الساعات الطبيب الدكتور",
      "عمل الطبيب",
      "ساعات",
      "مواعيد",
    ],
    answer:
      "يمكنك التواصل معنا خلال جميع ايام الاسبوع عن طريق التطبيق طبيبي والطبيب موجود في عيادته من يوم الاثنين حتى الجمعه",
  },
  {
    keywords: [
      "مكان العياده",
      "موقع العيادة",
      "المكان",
      "الموقع",
      "العياده",
      "العيادة",
      "مكان الطبيب",
      "موقع الطبيب",
      "المكان",
      "الموقع",
      "الطبيب",
      "مكان الدكتور",
      "موقع الدكتور",
      "المكان",
      "الموقع",
      "الدكتور",
    ],
    answer: "Use Waze to drive to כפר מנדא: https://waze.com/ul/hsvc4dk2dr",
  },
];

export const findFaqAnswer = (input: string) => {
  for (const item of faq) {
    if (item.keywords.some((keyword) => input.includes(keyword))) {
      return item.answer;
    }
  }
  return null;
};

export const executeGpt = async (
  messages: Array<{ role: "system" | "user"; content: string }>
) => {
  try {
    // Check if the input matches an FAQ question
    const faqAnswer = findFaqAnswer(messages[messages.length - 1].content);
    if (faqAnswer) {
      return faqAnswer; // Return the matched FAQ answer
    }

    // Send the updated conversation history to OpenAI for completion
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // use GPT-3.5 to save on cost
      messages,
      max_tokens: 200, // limit to encourage shorter answers
      temperature: 0.5, // reduce the randomness of the output
    });

    return response;
  } catch (e: any) {
    console.error(e);
    throw new AppError(e.message, 405);
  }
};
