import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default async function Page() {




    return (
        <div className="relative">
            <div className="absolute left-8 -top-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Consultas</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex justify-between pt-5 mb-5">
                <div>

                </div>
                <div className="text-right mr-2">

                </div>
            </div>
            <div className="mb-5">

            </div>
            <div>

            </div>
        </div>
    );
}
