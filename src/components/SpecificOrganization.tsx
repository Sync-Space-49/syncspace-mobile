import React from "react";
import CustomList from "./CustomList";
import type { Organization } from "../types"
interface SpecificOrganizationProps {
    org: Organization;
}
const SpecificOrganization: React.FC<SpecificOrganizationProps> = (org) => {
    return (
        <>
            <CustomList
                title={org.org.name}
                titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
                items={[
                    {
                        // text: {org.description},
                        text: "SyncSpace Mobile",
                        listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
                    },
                    {
                        // text: {org.description},
                        text: "SyncSpace Web",
                        listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
                    }
                ]} />
        </>
    );
};

export default SpecificOrganization;
