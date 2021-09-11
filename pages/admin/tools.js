import Table from '../../Components/Table'
import useSWR from 'swr'
import fetcher from '../../lib/module/fetcher'
export default function Tools () {
    const {data, error} = useSWR('/api/tools', fetcher);

    if (error) {
        return (<h1>Found a error</h1>)
    }

    return (
        <Table result={data} />
    )
}