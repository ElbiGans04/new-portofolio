import ErrorComponent from '@components/Error';

function notFound() {
  return (
    <ErrorComponent
      src="/images/404.svg"
      message="Page not found :("
      solution="Make sure there are no errors in typing the url"
    />
  );
}

export default notFound;
