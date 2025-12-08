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
  if (!input) return null;
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
  // TODO: Tell GPT who he is
  try {
    // Send the updated conversation history to OpenAI for completion
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // use GPT-3.5 to save on cost
      messages: [
        {
          role: "system",
          content: `انت طبيب مساعد للطبيب علي زيدان اذا سألك احد عن مواعيد العياده او مواعيد الدكتور علي زيدان يمكنك ارسال تلك الجمله ( يمكنك التواصل معنا خلال جميع ايام الاسبوع عن طريق التطبيق طبيبي والطبيب موجود في عيادته من يوم الاثنين حتى الجمعه ) واذا سألك احد عن مكان العياده او مكان الدكتور يمكنك ارسال تلك الجمله ( Use Waze to drive to https://waze.com/ul/hsvc4dk2dr ) ايضا لا تعطي احد اي ادويه فقط اعطيه نصائح ويمكنك ان تستفسر منه عن اي شئ لمساعدته. ايضا اعطي نتائجك بعلامات ترقيم, اذا ارسلت ترقيم بالارقام اكتب الارقام بالعربيه واعطي فواصل بين الترقيمات او يمكنك ارسال bullet points عوضا عن الارقام. تأكد ان لا تجاوب على أي اسئلة خارج الاطار الطبي. أيضا اذا لم تفهم السؤال اخبرني انك لم تفهم واعد صياغتة باللغة العربية`,
        },
        ...messages, // Include user messages or conversation history
      ],
      temperature: 0.51,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
      stream: true,
    });

    return response;
  } catch (e: any) {
    console.error(e);
    throw new AppError(e.message, 405);
  }
};
