import { WaterscanPage } from './app.po';

describe('waterscan App', () => {
  let page: WaterscanPage;

  beforeEach(() => {
    page = new WaterscanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
