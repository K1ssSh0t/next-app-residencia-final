import { EyeIcon, PencilIcon, TrashIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UsersWithRelations } from "@/repositories/user-repository";

export function UserTable({ userList }: { userList: UsersWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Email Verified</TableHead>
          {/* <TableHead>Image</TableHead> */}
          <TableHead>Role</TableHead>
          <TableHead>Nivel Educativo</TableHead>
          <TableHead>Password</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.emailVerified?.toLocaleString()}</TableCell>
            {/* <TableCell>{user.image}</TableCell> */}
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.nivelEducativo ? "Superior" : "Media Superior"}</TableCell>
            <TableCell>{user.password}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/users/${user.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/users/${user.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/users/${user.id}/delete`}>
                <Button size="icon" variant="outline">
                  <TrashIcon />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
