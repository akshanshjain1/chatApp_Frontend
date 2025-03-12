import React from "react";
import {Helmet} from 'react-helmet-async'
function Title({title='Chatkaro',descripiton="Instant End-To-End encrypted messaging"}){
    return <Helmet><title>{title}</title>
    <meta name="description" content={descripiton}/>
    </Helmet>

}
export default Title
