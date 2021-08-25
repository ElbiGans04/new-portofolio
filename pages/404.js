import ErrorComponent from '../Components/Error'

function notFound () {
    return (
        <ErrorComponent src="/images/404.svg" message="Page not found :(" solution="Make sure there are no errors in typing the url"></ErrorComponent>
    )
}

export default notFound;