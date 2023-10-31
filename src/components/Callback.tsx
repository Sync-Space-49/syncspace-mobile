import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, useHistory } from "react-router-dom";

const Callback: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            <Redirect from="/callback" to="/app" />
        }
    }, [isLoading, isAuthenticated]);

    return (
        <div>
            Redirecting...
        </div>
    );
}

export default Callback;