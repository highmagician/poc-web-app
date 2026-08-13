export type Language = 'en' | 'th';

export interface Translations {
  common: {
    siteName: string;
    languageName: string;
  };
  workshop: {
    badge: string;
    title: string;
    subtitle: string;
    intro: string[];
    highlightsTitle: string;
    highlights: string[];
    coursesTitle: string;
    coursesSubtitle: string;
    perPerson: string;
    duration: string;
    hours: string;
    schedule: string;
    seatsLeft: string;
    select: string;
    formTitle: string;
    formSubtitle: string;
    fields: {
      course: string;
      coursePlaceholder: string;
      fullName: string;
      email: string;
      phone: string;
      preferredDate: string;
      participants: string;
      notes: string;
      notesPlaceholder: string;
    };
    validation: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
      participantsRange: string;
    };
    submit: string;
    submitting: string;
    submitError: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    courseSummary: string;
    applicantSummary: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    participants: string;
    notes: string;
    noNotes: string;
    total: string;
    backToWorkshop: string;
    proceedToPayment: string;
    emptyTitle: string;
    emptyMessage: string;
    emptyCta: string;
  };
  payment: {
    title: string;
    subtitle: string;
    demoNotice: string;
    methodTitle: string;
    methods: {
      card: string;
      promptpay: string;
      transfer: string;
    };
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    orderTotal: string;
    payNow: string;
    processing: string;
    submitError: string;
    backToCheckout: string;
    emptyTitle: string;
    emptyMessage: string;
    emptyCta: string;
    successTitle: string;
    successMessage: string;
    reviewTitle: string;
    reviewMessage: string;
    referenceLabel: string;
    backHome: string;
    slipLabel: string;
    slipRequired: string;
    slipTooLarge: string;
    promptpayQrAlt: string;
    promptpayQrLoading: string;
    promptpayQrError: string;
    slip: {
      targetAccount: string;
      transferAmount: string;
      noFixedAmount: string;
      description: string;
      download: string;
    };
  };
  adminLogin: {
    title: string;
    subtitle: string;
    signInButton: string;
    signingIn: string;
    signInError: string;
    notAllowedError: string;
  };
  admin: {
    title: string;
    subtitle: string;
    signedInAs: string;
    signOutButton: string;
    emptyTitle: string;
    emptyMessage: string;
    backToWorkshop: string;
    cancelButton: string;
    cancelConfirm: string;
    approveButton: string;
    rejectButton: string;
    rejectConfirm: string;
    downloadSlip: string;
    loadError: string;
    settings: {
      title: string;
      promptpayIdLabel: string;
      promptpayIdHint: string;
      saveButton: string;
      savedMessage: string;
      invalidFormat: string;
    };
    statusLabels: {
      pending: string;
      review: string;
      paid: string;
    };
    columns: {
      createdAt: string;
      reference: string;
      course: string;
      applicant: string;
      contact: string;
      date: string;
      participants: string;
      method: string;
      total: string;
      slip: string;
      status: string;
      actions: string;
    };
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    common: {
      siteName: 'Homie Bakery',
      languageName: 'English',
    },
    workshop: {
      badge: 'Bakery Workshop',
      title: 'Bake like home, at Homie Bakery',
      subtitle: 'Small-batch baking classes taught in a real working bakery kitchen',
      intro: [
        'Homie Bakery started in a home kitchen with a single wood-fired oven, and that homey feeling is still what we teach today.',
        'Our workshops are hands-on and small in size, so every student gets real oven time, real dough in their hands, and real answers to their questions.',
        'Whether you have never baked before or you are chasing the perfect open crumb, we have a class for you.',
      ],
      highlightsTitle: 'Why bake with us',
      highlights: [
        'Small classes, max 8 students per session',
        'All ingredients, tools, and aprons provided',
        'Take home everything you bake, plus the recipe card',
        'Taught by our head baker in our own kitchen',
      ],
      coursesTitle: 'Upcoming courses',
      coursesSubtitle: 'Pick a course below and reserve your spot with the application form',
      perPerson: 'per person',
      duration: 'Duration',
      hours: 'hours',
      schedule: 'Next session',
      seatsLeft: 'seats left',
      select: 'Select this course',
      formTitle: 'Apply for a course',
      formSubtitle: "Tell us about yourself and we'll hold your seat while you complete checkout",
      fields: {
        course: 'Course',
        coursePlaceholder: 'Choose a course',
        fullName: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        preferredDate: 'Preferred date',
        participants: 'Number of participants',
        notes: 'Notes for the baker',
        notesPlaceholder: 'Allergies, dietary needs, or anything else we should know',
      },
      validation: {
        required: 'This field is required',
        invalidEmail: 'Enter a valid email address',
        invalidPhone: 'Enter a valid phone number',
        participantsRange: 'Choose between 1 and 8 participants',
      },
      submit: 'Continue to checkout',
      submitting: 'Submitting…',
      submitError: "Couldn't submit your application. Please try again.",
    },
    checkout: {
      title: 'Checkout',
      subtitle: 'Review your course application before payment',
      courseSummary: 'Course',
      applicantSummary: 'Applicant details',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Preferred date',
      participants: 'Participants',
      notes: 'Notes',
      noNotes: 'No notes provided',
      total: 'Total due',
      backToWorkshop: 'Back to edit application',
      proceedToPayment: 'Proceed to payment',
      emptyTitle: 'No application found',
      emptyMessage: 'Start by choosing a course and filling in the application form.',
      emptyCta: 'Go to workshop page',
    },
    payment: {
      title: 'Payment',
      subtitle: 'Complete your booking for the Homie Bakery workshop',
      demoNotice: 'This is a POC demo. No real payment is processed.',
      methodTitle: 'Payment method',
      methods: {
        card: 'Credit / debit card',
        promptpay: 'PromptPay QR',
        transfer: 'Bank transfer',
      },
      cardholderName: 'Cardholder name',
      cardNumber: 'Card number',
      expiry: 'Expiry',
      cvv: 'CVV',
      orderTotal: 'Amount to pay',
      payNow: 'Pay now',
      processing: 'Processing…',
      submitError: "Couldn't confirm your payment. Please try again.",
      backToCheckout: 'Back to checkout',
      emptyTitle: 'Nothing to pay for yet',
      emptyMessage: 'Please apply for a course and complete checkout first.',
      emptyCta: 'Go to workshop page',
      successTitle: 'Payment received, see you in the kitchen!',
      successMessage: "We've sent a confirmation to your email with the class details.",
      reviewTitle: "We've received your slip",
      reviewMessage: "Our team will verify your transfer shortly. We'll email you once it's confirmed.",
      referenceLabel: 'Booking reference',
      backHome: 'Back to workshop page',
      slipLabel: 'Upload your transfer slip',
      slipRequired: 'Please upload your transfer slip to continue.',
      slipTooLarge: 'That file is too large. Please upload an image under 8MB.',
      promptpayQrAlt: 'PromptPay QR code',
      promptpayQrLoading: 'Generating QR…',
      promptpayQrError: "Couldn't generate the QR code. Please try again.",
      slip: {
        targetAccount: 'Target account',
        transferAmount: 'Transfer amount',
        noFixedAmount: 'No fixed amount — enter in your banking app',
        description: 'Description',
        download: 'Download QR image',
      },
    },
    adminLogin: {
      title: 'Admin sign-in',
      subtitle: 'Sign in with your Google account to manage workshop applications.',
      signInButton: 'Sign in with Google',
      signingIn: 'Signing in…',
      signInError: "Couldn't sign in. Please try again.",
      notAllowedError: 'This Google account is not authorized for admin access.',
    },
    admin: {
      title: 'Workshop applications',
      subtitle: 'All course applications submitted through the apply form',
      signedInAs: 'Signed in as',
      signOutButton: 'Sign out',
      emptyTitle: 'No applications yet',
      emptyMessage: 'Submitted applications will show up here.',
      backToWorkshop: 'Back to workshop page',
      cancelButton: 'Cancel booking',
      cancelConfirm: 'Cancel this booking? This cannot be undone.',
      approveButton: 'Approve',
      rejectButton: 'Reject',
      rejectConfirm: 'Reject this slip? The applicant will need to submit payment again.',
      downloadSlip: 'View slip',
      loadError: "Couldn't load applications. Please try again.",
      settings: {
        title: 'PromptPay settings',
        promptpayIdLabel: 'PromptPay ID',
        promptpayIdHint: 'Phone number (10 digits), citizen/tax ID (13 digits), or e-Wallet ID (15 digits).',
        saveButton: 'Save',
        savedMessage: 'Saved. New PromptPay QR codes will use this ID.',
        invalidFormat: 'Enter a valid 10, 13, or 15-digit PromptPay ID with no spaces or dashes.',
      },
      statusLabels: {
        pending: 'Pending payment',
        review: 'Awaiting slip review',
        paid: 'Paid',
      },
      columns: {
        createdAt: 'Submitted',
        reference: 'Reference',
        course: 'Course',
        applicant: 'Applicant',
        contact: 'Contact',
        date: 'Preferred date',
        participants: 'Participants',
        method: 'Payment method',
        total: 'Total',
        slip: 'Slip',
        status: 'Status',
        actions: 'Actions',
      },
    },
  },
  th: {
    common: {
      siteName: 'โฮมมี่ เบเกอรี่',
      languageName: 'ไทย',
    },
    workshop: {
      badge: 'เวิร์กช็อปเบเกอรี่',
      title: 'อบขนมแบบบ้านๆ ที่ โฮมมี่ เบเกอรี่',
      subtitle: 'คลาสเบเกอรี่กลุ่มเล็ก สอนสดในครัวเบเกอรี่จริง',
      intro: [
        'โฮมมี่ เบเกอรี่ เริ่มต้นจากครัวที่บ้านกับเตาอบฟืนเพียงเตาเดียว และความรู้สึกอบอุ่นแบบนั้นยังคงเป็นสิ่งที่เราสอนจนถึงวันนี้',
        'เวิร์กช็อปของเราเน้นลงมือทำจริงและรับจำนวนจำกัด เพื่อให้ผู้เรียนทุกคนได้ใช้เตาอบจริง นวดแป้งจริง และได้คำตอบที่ตรงกับคำถามของตัวเอง',
        'ไม่ว่าคุณจะไม่เคยอบขนมมาก่อน หรือกำลังตามหาเนื้อขนมปังที่สมบูรณ์แบบ เรามีคลาสที่เหมาะกับคุณ',
      ],
      highlightsTitle: 'ทำไมต้องเรียนกับเรา',
      highlights: [
        'คลาสกลุ่มเล็ก สูงสุด 8 คนต่อรอบ',
        'จัดเตรียมวัตถุดิบ อุปกรณ์ และผ้ากันเปื้อนให้ครบ',
        'นำขนมที่อบเองกลับบ้านได้ พร้อมสูตรอาหาร',
        'สอนโดยหัวหน้าเชฟเบเกอรี่ของเราในครัวของเราเอง',
      ],
      coursesTitle: 'คอร์สที่เปิดรับสมัคร',
      coursesSubtitle: 'เลือกคอร์สด้านล่างแล้วจองที่นั่งผ่านแบบฟอร์มสมัคร',
      perPerson: 'ต่อคน',
      duration: 'ระยะเวลา',
      hours: 'ชั่วโมง',
      schedule: 'รอบถัดไป',
      seatsLeft: 'ที่นั่งว่าง',
      select: 'เลือกคอร์สนี้',
      formTitle: 'สมัครเรียนคอร์ส',
      formSubtitle: 'บอกข้อมูลของคุณ แล้วเราจะกันที่นั่งไว้ระหว่างที่คุณทำการชำระเงิน',
      fields: {
        course: 'คอร์ส',
        coursePlaceholder: 'เลือกคอร์ส',
        fullName: 'ชื่อ-นามสกุล',
        email: 'อีเมล',
        phone: 'เบอร์โทรศัพท์',
        preferredDate: 'วันที่ต้องการเข้าเรียน',
        participants: 'จำนวนผู้เข้าร่วม',
        notes: 'หมายเหตุถึงเชฟ',
        notesPlaceholder: 'แพ้อาหาร ข้อจำกัดด้านอาหาร หรือสิ่งอื่นที่อยากแจ้งให้เราทราบ',
      },
      validation: {
        required: 'กรุณากรอกข้อมูลนี้',
        invalidEmail: 'กรุณากรอกอีเมลให้ถูกต้อง',
        invalidPhone: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง',
        participantsRange: 'กรุณาเลือกจำนวนผู้เข้าร่วมระหว่าง 1 ถึง 8 คน',
      },
      submit: 'ดำเนินการชำระเงิน',
      submitting: 'กำลังส่งข้อมูล...',
      submitError: 'ไม่สามารถส่งใบสมัครได้ กรุณาลองใหม่อีกครั้ง',
    },
    checkout: {
      title: 'สรุปคำสั่งซื้อ',
      subtitle: 'ตรวจสอบใบสมัครคอร์สของคุณก่อนชำระเงิน',
      courseSummary: 'คอร์ส',
      applicantSummary: 'ข้อมูลผู้สมัคร',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      date: 'วันที่ต้องการ',
      participants: 'จำนวนผู้เข้าร่วม',
      notes: 'หมายเหตุ',
      noNotes: 'ไม่มีหมายเหตุ',
      total: 'ยอดรวมที่ต้องชำระ',
      backToWorkshop: 'กลับไปแก้ไขใบสมัคร',
      proceedToPayment: 'ดำเนินการชำระเงิน',
      emptyTitle: 'ไม่พบใบสมัคร',
      emptyMessage: 'กรุณาเลือกคอร์สและกรอกแบบฟอร์มสมัครก่อน',
      emptyCta: 'ไปที่หน้าเวิร์กช็อป',
    },
    payment: {
      title: 'ชำระเงิน',
      subtitle: 'ทำรายการจองเวิร์กช็อปของ โฮมมี่ เบเกอรี่ ให้เสร็จสมบูรณ์',
      demoNotice: 'นี่คือหน้าสาธิตสำหรับ POC ไม่มีการชำระเงินจริงเกิดขึ้น',
      methodTitle: 'วิธีการชำระเงิน',
      methods: {
        card: 'บัตรเครดิต / เดบิต',
        promptpay: 'พร้อมเพย์ (QR)',
        transfer: 'โอนผ่านธนาคาร',
      },
      cardholderName: 'ชื่อผู้ถือบัตร',
      cardNumber: 'หมายเลขบัตร',
      expiry: 'วันหมดอายุ',
      cvv: 'CVV',
      orderTotal: 'จำนวนเงินที่ต้องชำระ',
      payNow: 'ชำระเงินตอนนี้',
      processing: 'กำลังดำเนินการ...',
      submitError: 'ไม่สามารถยืนยันการชำระเงินได้ กรุณาลองใหม่อีกครั้ง',
      backToCheckout: 'กลับไปหน้าสรุปคำสั่งซื้อ',
      emptyTitle: 'ยังไม่มีรายการที่ต้องชำระ',
      emptyMessage: 'กรุณาสมัครคอร์สและทำรายการสรุปคำสั่งซื้อก่อน',
      emptyCta: 'ไปที่หน้าเวิร์กช็อป',
      successTitle: 'ชำระเงินสำเร็จ แล้วเจอกันในครัวนะ!',
      successMessage: 'เราได้ส่งอีเมลยืนยันพร้อมรายละเอียดคลาสไปให้คุณแล้ว',
      reviewTitle: 'เราได้รับสลิปของคุณแล้ว',
      reviewMessage: 'ทีมงานจะตรวจสอบการโอนเงินของคุณและอีเมลแจ้งผลให้ทราบเร็วๆ นี้',
      referenceLabel: 'หมายเลขอ้างอิงการจอง',
      backHome: 'กลับไปหน้าเวิร์กช็อป',
      slipLabel: 'อัปโหลดสลิปการโอนเงิน',
      slipRequired: 'กรุณาอัปโหลดสลิปการโอนเงินเพื่อดำเนินการต่อ',
      slipTooLarge: 'ไฟล์มีขนาดใหญ่เกินไป กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 8MB',
      promptpayQrAlt: 'คิวอาร์โค้ดพร้อมเพย์',
      promptpayQrLoading: 'กำลังสร้างคิวอาร์โค้ด...',
      promptpayQrError: 'ไม่สามารถสร้างคิวอาร์โค้ดได้ กรุณาลองใหม่อีกครั้ง',
      slip: {
        targetAccount: 'บัญชีปลายทาง',
        transferAmount: 'จำนวนเงินที่โอน',
        noFixedAmount: 'ไม่ระบุจำนวนเงิน — กรุณากรอกในแอปธนาคาร',
        description: 'รายละเอียด',
        download: 'ดาวน์โหลดรูปคิวอาร์',
      },
    },
    adminLogin: {
      title: 'เข้าสู่ระบบผู้ดูแล',
      subtitle: 'เข้าสู่ระบบด้วยบัญชี Google เพื่อจัดการใบสมัครเวิร์กช็อป',
      signInButton: 'เข้าสู่ระบบด้วย Google',
      signingIn: 'กำลังเข้าสู่ระบบ…',
      signInError: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง',
      notAllowedError: 'บัญชี Google นี้ไม่มีสิทธิ์เข้าใช้งานระบบผู้ดูแล',
    },
    admin: {
      title: 'รายการสมัครเรียนเวิร์กช็อป',
      subtitle: 'ใบสมัครคอร์สทั้งหมดที่ส่งผ่านแบบฟอร์มสมัคร',
      signedInAs: 'เข้าสู่ระบบในชื่อ',
      signOutButton: 'ออกจากระบบ',
      emptyTitle: 'ยังไม่มีใบสมัคร',
      emptyMessage: 'ใบสมัครที่ส่งเข้ามาจะแสดงที่นี่',
      backToWorkshop: 'กลับไปหน้าเวิร์กช็อป',
      cancelButton: 'ยกเลิกการจอง',
      cancelConfirm: 'ยืนยันยกเลิกการจองนี้ใช่หรือไม่ การดำเนินการนี้ไม่สามารถย้อนกลับได้',
      approveButton: 'อนุมัติ',
      rejectButton: 'ปฏิเสธ',
      rejectConfirm: 'ยืนยันปฏิเสธสลิปนี้ใช่หรือไม่ ผู้สมัครจะต้องส่งการชำระเงินใหม่',
      downloadSlip: 'ดูสลิป',
      loadError: 'ไม่สามารถโหลดรายการใบสมัครได้ กรุณาลองใหม่อีกครั้ง',
      settings: {
        title: 'ตั้งค่าพร้อมเพย์',
        promptpayIdLabel: 'หมายเลขพร้อมเพย์',
        promptpayIdHint: 'เบอร์โทรศัพท์ (10 หลัก), เลขบัตรประชาชน/เลขผู้เสียภาษี (13 หลัก), หรือหมายเลข e-Wallet (15 หลัก)',
        saveButton: 'บันทึก',
        savedMessage: 'บันทึกแล้ว คิวอาร์โค้ดพร้อมเพย์ใหม่จะใช้หมายเลขนี้',
        invalidFormat: 'กรุณากรอกหมายเลขพร้อมเพย์ที่ถูกต้อง 10, 13 หรือ 15 หลัก โดยไม่มีเว้นวรรคหรือขีด',
      },
      statusLabels: {
        pending: 'รอชำระเงิน',
        review: 'รอตรวจสอบสลิป',
        paid: 'ชำระเงินแล้ว',
      },
      columns: {
        createdAt: 'วันที่สมัคร',
        reference: 'หมายเลขอ้างอิง',
        course: 'คอร์ส',
        applicant: 'ผู้สมัคร',
        contact: 'ช่องทางติดต่อ',
        date: 'วันที่ต้องการ',
        participants: 'จำนวนผู้เข้าร่วม',
        method: 'วิธีชำระเงิน',
        total: 'ยอดรวม',
        slip: 'สลิป',
        status: 'สถานะ',
        actions: 'การจัดการ',
      },
    },
  },
};
