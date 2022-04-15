test('MONGODB_URI ENV Variabel is exists', () => {
  expect(process.env.MONGODB_URI).toBeDefined();
});

test('EMAIL ENV Variabel is exists', () => {
  expect(process.env.EMAIL).toBeDefined();
});

test('PW ENV Variabel is exists', () => {
  expect(process.env.PW).toBeDefined();
});

test('NEXT_PUBLIC_FIREBASE_API_KEY ENV Variabel is exists', () => {
  expect(process.env.NEXT_PUBLIC_FIREBASE_API_KEY).toBeDefined();
});

test('NEXT_PUBLIC_FIREBASE_PROJECT_NAME ENV Variabel is exists', () => {
  expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_NAME).toBeDefined();
});

test('NEXT_PUBLIC_FIREBASE_APP_ID ENV Variabel is exists', () => {
  expect(process.env.NEXT_PUBLIC_FIREBASE_APP_ID).toBeDefined();
});

test('PRIVATE_KEY ENV Variabel is exists', () => {
  expect(process.env.PRIVATE_KEY).toBeDefined();
});

test('PUBLIC_KEY ENV Variabel is exists', () => {
  expect(process.env.PUBLIC_KEY).toBeDefined();
});

export {};
