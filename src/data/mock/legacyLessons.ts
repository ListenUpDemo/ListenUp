import type { Lesson } from "../../types";
export const topics = [
  {
    slug: "everyday",
    name: "Giao tiếp hằng ngày",
    description: "Những cuộc trò chuyện nhỏ, sự tự tin lớn.",
    icon: "coffee",
    color: "peach",
  },
  {
    slug: "travel",
    name: "Du lịch & khám phá",
    description: "Sẵn sàng cho hành trình tiếp theo của bạn.",
    icon: "plane",
    color: "blue",
  },
  {
    slug: "work",
    name: "Công việc & học tập",
    description: "Lắng nghe tốt hơn, kết nối hiệu quả hơn.",
    icon: "briefcase",
    color: "purple",
  },
  {
    slug: "stories",
    name: "Cuộc sống & câu chuyện",
    description: "Mở rộng thế giới qua từng câu chuyện.",
    icon: "book",
    color: "green",
  },
];
export const lessons: Lesson[] = [
  {
    id: "coffee-shop",
    slug: "at-the-coffee-shop",
    title: "At the Coffee Shop",
    description:
      "Gọi một ly cà phê yêu thích và bắt đầu ngày mới bằng một cuộc hội thoại thật tự nhiên.",
    level: "A2",
    topic: "everyday",
    duration: 56,
    color: "peach",
    icon: "coffee",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/beginner/coffee-shop.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/coffee-shop.json`,
    questions: [
      {
        id: "c1",
        prompt: "What would the customer like to order?",
        options: [
          "A cup of tea",
          "A cappuccino",
          "An orange juice",
          "A hot chocolate",
        ],
        answer: 1,
        explanation:
          "Khách nói: “I would like a cappuccino, please.” — Khách muốn gọi cappuccino.",
      },
      {
        id: "c2",
        prompt: "What size does the customer choose?",
        options: ["Small", "Medium", "Large", "Extra large"],
        answer: 1,
        explanation: "Khách chọn cỡ vừa: “A medium, please.”",
      },
      {
        id: "c3",
        prompt: "What does the customer want to eat?",
        options: [
          "A sandwich",
          "A cookie",
          "A chocolate croissant",
          "A muffin",
        ],
        answer: 2,
        explanation:
          "Khách gọi thêm bánh: “A chocolate croissant would be lovely.”",
      },
      {
        id: "c4",
        prompt: "How much is the order?",
        options: ["$5.50", "$6.50", "$7.50", "$8.50"],
        answer: 2,
        explanation:
          "Nhân viên thông báo: “That will be seven dollars and fifty cents.”",
      },
      {
        id: "c5",
        prompt: "Where will the customer have the order?",
        options: [
          "At home",
          "At the office",
          "On the train",
          "At the coffee shop",
        ],
        answer: 3,
        explanation: "Khách nói “For here” và muốn ngồi cạnh cửa sổ.",
      },
    ],
  },
  {
    id: "airport",
    slug: "a-ticket-to-london",
    title: "A Ticket to London",
    description:
      "Làm thủ tục tại sân bay, hỏi về hành lý và tìm đúng cửa khởi hành.",
    level: "A2",
    topic: "travel",
    duration: 52,
    color: "blue",
    icon: "plane",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/beginner/airport.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/airport.json`,
    questions: [
      {
        id: "a1",
        prompt: "Where is the passenger going?",
        options: ["Paris", "London", "Tokyo", "Sydney"],
        answer: 1,
        explanation: "Hành khách nói “I am flying to London today.”",
      },
      {
        id: "a2",
        prompt: "How many bags does the passenger check in?",
        options: ["One", "Two", "Three", "None"],
        answer: 0,
        explanation: "Hành khách có một vali: “Just one suitcase.”",
      },
      {
        id: "a3",
        prompt: "Which gate should the passenger go to?",
        options: ["Gate 8", "Gate 12", "Gate 15", "Gate 20"],
        answer: 1,
        explanation: "Nhân viên nói “Your flight leaves from gate twelve.”",
      },
    ],
  },
  {
    id: "weekend",
    slug: "making-weekend-plans",
    title: "Making Weekend Plans",
    description:
      "Một buổi picnic, vài người bạn và những kế hoạch cuối tuần đầy hứng khởi.",
    level: "A1",
    topic: "everyday",
    duration: 44,
    color: "green",
    icon: "sun",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/beginner/weekend.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/weekend.json`,
    questions: [
      {
        id: "w1",
        prompt: "What are they planning?",
        options: ["A picnic", "A movie night", "A shopping trip", "A concert"],
        answer: 0,
        explanation: "Anna đề nghị “Let us have a picnic in the park.”",
      },
      {
        id: "w2",
        prompt: "When will they meet?",
        options: ["At nine", "At ten", "At eleven", "At twelve"],
        answer: 2,
        explanation:
          "Họ thống nhất gặp nhau lúc 11 giờ: “Shall we meet at eleven?”",
      },
      {
        id: "w3",
        prompt: "What will Ben bring?",
        options: ["Drinks", "Sandwiches", "Fruit", "A guitar"],
        answer: 1,
        explanation: "Ben nói “I can bring some sandwiches.”",
      },
    ],
  },
  {
    id: "meeting",
    slug: "the-monday-meeting",
    title: "The Monday Meeting",
    description:
      "Nắm bắt thông tin quan trọng trong một buổi họp nhóm đầu tuần.",
    level: "B1",
    topic: "work",
    duration: 55,
    color: "purple",
    icon: "briefcase",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/intermediate/meeting.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/meeting.json`,
    questions: [
      {
        id: "m1",
        prompt: "When is the project deadline?",
        options: ["Monday", "Wednesday", "Friday", "Next month"],
        answer: 2,
        explanation:
          "Quản lý nhắc: “The deadline for our project is this Friday.”",
      },
      {
        id: "m2",
        prompt: "What is Sarah responsible for?",
        options: [
          "The budget",
          "The presentation",
          "The research",
          "The website",
        ],
        answer: 1,
        explanation: "Sarah nói “I will prepare the presentation.”",
      },
      {
        id: "m3",
        prompt: "When is the next check-in?",
        options: [
          "Tuesday afternoon",
          "Wednesday morning",
          "Thursday evening",
          "Friday morning",
        ],
        answer: 1,
        explanation: "Nhóm sẽ họp lại “on Wednesday morning”.",
      },
    ],
  },
  {
    id: "bookshop",
    slug: "a-little-bookshop",
    title: "A Little Bookshop",
    description:
      "Ghé thăm một hiệu sách nhỏ và lắng nghe câu chuyện của người chủ.",
    level: "B1",
    topic: "stories",
    duration: 49,
    color: "rose",
    icon: "book",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/intermediate/bookshop.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/bookshop.json`,
    questions: [
      {
        id: "b1",
        prompt: "When did Emma open the bookshop?",
        options: [
          "Last year",
          "Five years ago",
          "Ten years ago",
          "Twenty years ago",
        ],
        answer: 2,
        explanation: "Emma nói “I opened this bookshop ten years ago.”",
      },
      {
        id: "b2",
        prompt: "What did the building use to be?",
        options: ["A bakery", "A school", "A library", "A house"],
        answer: 0,
        explanation:
          "Tòa nhà từng là tiệm bánh: “The building used to be a bakery.”",
      },
      {
        id: "b3",
        prompt: "What happens every Saturday?",
        options: [
          "A cooking class",
          "A book sale",
          "A reading group",
          "A music lesson",
        ],
        answer: 2,
        explanation: "Emma tổ chức nhóm đọc sách vào mỗi thứ Bảy.",
      },
    ],
  },
  {
    id: "remote-work",
    slug: "rethinking-remote-work",
    title: "Rethinking Remote Work",
    description:
      "Khám phá những góc nhìn khác nhau về tương lai của làm việc từ xa.",
    level: "B2",
    topic: "work",
    duration: 61,
    color: "sand",
    icon: "laptop",
    audioUrl: `${import.meta.env.BASE_URL}assets/audio/advanced/remote-work.wav`,
    transcriptUrl: `${import.meta.env.BASE_URL}assets/transcripts/remote-work.json`,
    questions: [
      {
        id: "r1",
        prompt: "What is the main benefit mentioned?",
        options: [
          "Higher salaries",
          "Flexibility",
          "More meetings",
          "Free equipment",
        ],
        answer: 1,
        explanation:
          "Người nói nhấn mạnh “The greatest advantage is flexibility.”",
      },
      {
        id: "r2",
        prompt: "What challenge does the speaker describe?",
        options: ["Commuting", "Office noise", "Isolation", "Travel costs"],
        answer: 2,
        explanation:
          "Thách thức được đề cập là cảm giác cô lập: “a sense of isolation”.",
      },
      {
        id: "r3",
        prompt: "What does the speaker recommend?",
        options: [
          "Working every weekend",
          "A hybrid approach",
          "Closing all offices",
          "Longer working hours",
        ],
        answer: 1,
        explanation: "Người nói đề xuất mô hình kết hợp: “a hybrid approach”.",
      },
    ],
  },
];
export const levelLabels = {
  A1: "Cơ bản",
  A2: "Sơ cấp",
  B1: "Trung cấp",
  B2: "Trên trung cấp",
};
