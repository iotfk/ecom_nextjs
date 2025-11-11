import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LatestOrders = () => {
  return (
   <Table>

  <TableHeader>
    <TableRow>
      <TableHead>Order Id</TableHead>
         <TableHead>Payment Id</TableHead>
          <TableHead>Customer</TableHead>
           <TableHead>Total item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {Array.from({length: 20}).map((_, index) => (
      <TableRow key={index}>
        <TableCell>{`ORD${index + 1}`}</TableCell>
        <TableCell>{`PAY${index + 1}`}</TableCell>
        <TableCell>{`CUS${index + 1}`}</TableCell>
        <TableCell>5</TableCell>
        <TableCell>pending</TableCell>
        <TableCell>6562</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
  )
}

export default LatestOrders