import React, { useEffect, useState } from "react";
import CustomList from "./CustomList";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";

// interface SpecificOrganizationProps {
//     organizations?: Array<{}>;
// }

/* 
    for future tyler: reincorporate server request into this file but as a separate method i.e 
        getOrganizations {
            options
            axios request
            ..
        }
    and put that in the useEffect hook to make sure that we always have something

    perhaps for the customListComponents, call the method that populates it after getOrganizations
    in the useEffect hook? maybe something will load? 
        if not, get sumi/dylan
*/


// const SpecificOrganization: React.FC<SpecificOrganizationProps> = (organizations) => {
const SpecificOrganization: React.FC = () => {


    const { getAccessTokenSilently, user } = useAuth0();
    const [isLoading, setIsLoading] = useState(false);
    // const [organizations, setOrganizations] = useState([]);

    // const [organizationCount, setOrganizationCount] = useState(0);
    let customListComponents: any[] = [];
    let fu

    const getOrganizations = async () => {
        setIsLoading(true);
        let token = await getAccessTokenSilently();
        const userId = user!.sub;
        const options = {
            method: "GET",
            url: `${serverAdress}api/users/${userId}/organizations`,
            headers: { authorization: `Bearer ${token}` },
        };

        axios(options)
            .then((response) => {
                const userOrganizations = response.data;
                console.log('userOrgs: '+ userOrganizations);
                getAllOrgs(userOrganizations);
            })
            .catch((error) => {
                console.log(error);
            });
        setIsLoading(false);
    }

    const getAllOrgs = (organizations:any[]) => {
        if (organizations.length > 0) {
            for (let i = 0; i < organizations.length; i++) {
                // <h3 className="ion-padding">i'm a heading</h3>
                // console.log('org ' + organizations)
                let title = organizations[i].name;
                // let title = 'org[i].name';
                let text = organizations[i].description;
                console.log('title: ' + title);
                console.log('text: ' + text);
                console.log('i: ' + i);
                console.log('text: ' + text);
                customListComponents.push(
                    <CustomList
                    title={'another borg2'}
                    titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
                    items={[
                        {
                            text,
                            listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
                        }]}/>
                    );
                    // console.log("org: " + i);
                }
                // console.log("if: customListComponents: " + customListComponents)
            }
        }

    
    // const org: any = organizations;
    
    
        
        // useEffect(() => {
            //     getAllOrgs();
            //     // console.log("getAllOrgs called " + org[0].name)
            // }, [organizations]);
            useEffect(() => {
                getOrganizations();
                // setOrganizationCount(organizations.length)
                // getAllOrgs();
            }, [])
            
            return (
                <>
            <h1 className="ion-padding">org list</h1>
            {customListComponents}
        </>
    );
};

export default SpecificOrganization;
