import { Language } from '../../i18n/translations';

export interface WorkshopCourse {
  id: string;
  emoji: string;
  priceThb: number;
  durationHours: number;
  seatsLeft: number;
  nextSessionIso: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
}

export function getWorkshopCourseById(id: string): WorkshopCourse | undefined {
  return WORKSHOP_COURSES.find((course) => course.id === id);
}

export const WORKSHOP_COURSES: WorkshopCourse[] = [
  {
    id: 'sourdough-basics',
    emoji: '🍞',
    priceThb: 1800,
    durationHours: 4,
    seatsLeft: 5,
    nextSessionIso: '2026-08-09',
    name: {
      en: 'Sourdough Bread Basics',
      th: 'เบสิกขนมปังซาวร์โดว์',
    },
    description: {
      en: 'Learn to build and bake your own sourdough starter into a crackly, open-crumb loaf.',
      th: 'เรียนรู้การเลี้ยงหัวเชื้อซาวร์โดว์และอบขนมปังเนื้อโปร่ง เปลือกกรอบด้วยตัวเอง',
    },
  },
  {
    id: 'thai-milk-bread',
    emoji: '🥐',
    priceThb: 2200,
    durationHours: 5,
    seatsLeft: 3,
    nextSessionIso: '2026-08-16',
    name: {
      en: 'Thai Milk Bread & Custard Buns',
      th: 'ขนมปังนมสดไทยและซาลาเปาไส้คัสตาร์ด',
    },
    description: {
      en: 'Soft, pillowy milk bread and sweet custard-filled buns, Homie Bakery style.',
      th: 'ขนมปังนมสดเนื้อนุ่มฟู และซาลาเปาไส้คัสตาร์ดหวานหอม สไตล์โฮมมี่ เบเกอรี่',
    },
  },
  {
    id: 'butter-croissant',
    emoji: '🥖',
    priceThb: 2800,
    durationHours: 6,
    seatsLeft: 4,
    nextSessionIso: '2026-08-23',
    name: {
      en: 'Butter Croissant & Laminated Dough',
      th: 'ครัวซองต์เนยและแป้งพับชั้น',
    },
    description: {
      en: 'Master the fold-and-rest technique behind flaky, buttery layers of French pastry.',
      th: 'ฝึกเทคนิคการพับและพักแป้ง เพื่อให้ได้ครัวซองต์เนยชั้นบางกรอบสไตล์ฝรั่งเศส',
    },
  },
];
