import { BrowserRouter } from 'react-router-dom';
import { shape } from 'prop-types';

// Instantiate router context
const router = {
  history: new BrowserRouter().history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: shape({}) },
});

export function mountWrap(node) {
  const options = new ReactRouterEnzymeContext();
  return mount(node, options.get());
}