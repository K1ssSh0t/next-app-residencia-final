import { NavBar } from "@/components/admin/consultas/nav-bar-consultas";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";


export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <div>
            <div className="left-8 -top-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className=" font-bold text-xl">Consultas</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <NavBar />
            <div>


                {children}

            </div></div>
    );
}