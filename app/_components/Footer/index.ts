export { Footer } from './Footer';

// buildFooterProps is deliberately NOT re-exported here. It imports
// `tinacms/dist/react`, which calls createContext at module scope, so
// re-exporting it through this barrel drags that into every Server Component
// that imports Footer (/thank-you and /team/[slug] both 500'd with
// "createContext only works in Client Components"). Client components import
// it directly from "../Footer/buildFooterProps" instead.
