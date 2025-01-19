import React from "react";
import {Helmet} from 'react-helmet-async'
function Title({title='chat',descripiton="this is chat app"}){
    return <Helmet><title>{title}</title>
    <meta name="description" content={descripiton}/>
    </Helmet>

}
export default Title
