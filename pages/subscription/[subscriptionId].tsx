import {useRouter} from 'next/router'
import homeStyles from "@/styles/Home.module.css";
import styles from '@/styles/Subscription.module.css'
import React from "react";
import Header from "@/components/header/Header";
import {GetServerSidePropsContext, NextPage} from "next";

import * as Api from "@/api";
import {UpdateSubscriptionDTO} from "@/api/dto/subscription.dto";
import Subscription, {BriefProfile} from "@/components/subscription/Subscription";
import SubscriptionEdit from "@/components/subscription/edit/SubscriptionEdit";
import Footer from "@/components/footer/Footer";
import {AuthProps} from "@/pages/_app";
import {getAuthStatus} from "@/utils/getAuthStatus";

interface Props extends AuthProps{
    subscription: UpdateSubscriptionDTO;
    profile: BriefProfile
}

const SubscriptionPage: NextPage<Props> = ({subscription, profile}) => {
    const router = useRouter()
    const {edited} = router.query

    return (
        <main className={homeStyles.main}>
            <Header
                saveCallback={undefined}
                editAvailable={false}
                edited={false}
                setEdited={undefined}
                disabled={false}
                base64Logo={profile.logo.base64Image}
                profileId={profile.id!!}
            />

            <div className={styles.eventWrapper}>
                {
                    edited ?
                        <SubscriptionEdit data={subscription} profile={profile}/>
                        :
                        <Subscription subscription={subscription} profile={profile}/>
                }
            </div>

            <Footer/>
        </main>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const profileId = ctx.query!!.profileId as string;
        if (!profileId) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            }
        }

        const subscriptionId = ctx.query!!.subscriptionId as string;
        const cookie = ctx.req.headers.cookie

        console.log(`loading sub: ${subscriptionId}`);
        let subscription;
        const subscriptionPromise = Api.subscription.loadSubscription(subscriptionId, cookie).then(data => subscription = data);
        console.log(`loading profile: ${profileId}`);
        let profile;
        const profilePromise = await Api.profile.loadProfile(profileId, cookie)
            .then(data => ({id: data.id, title: data.title, logo: data.logo}))
            .then(data => profile = data);

        await Promise.all([subscriptionPromise, profilePromise]);

        console.log({
            authStatus: getAuthStatus(ctx),
            subscription: subscription,
            profile: profile
        })
        return {
            props: {
                authStatus: getAuthStatus(ctx),
                subscription: subscription,
                profile: profile
            }
        };
    } catch (err) {
        console.log(err);
        // todo add redirecting here
        return {
            props: {
                subscription: undefined,
                profile: undefined
            }
        };
    }
};

export default SubscriptionPage;