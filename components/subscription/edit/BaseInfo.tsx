import ImageUploader from "@/components/imageUploader/ImageUploader";
import Image from "next/image";
import discordIcon from "@/assets/social_media_logo/discord.svg";
import {ConfigProvider, Input, InputNumber, Select} from "antd";
import React from "react";
import styles from "@/styles/Subscription.module.css";
import {baseCoin, possibleTokens} from "@/utils/tokens";
import {NextPage} from "next";
import {ImageDto} from "@/api/dto/image.dto";

export interface BaseInfoErrors {
    title: boolean;
    description: boolean;
    price: boolean;
    base64MainImg: boolean;
    base64PreviewImg: boolean;
}

export function hasError(errors: BaseInfoErrors): boolean {
    return errors.title || errors.description || errors.price || errors.base64MainImg || errors.base64PreviewImg;
}

export interface BriefInfo {
    id: string | undefined;
    title: string;
    previewImageId: string | undefined,
    previewImageBase64: string | undefined;
}

export interface BaseInfoData {
    title: string;
    description: string;
    mainImage: ImageDto | undefined;
    previewImage: ImageDto | undefined;
    price: number
    coin: string;
}

interface Props {
    data: BaseInfoData;
    setter: (data: BaseInfoData) => void;
    isLoading: boolean;
    errors: BaseInfoErrors | undefined;
}

const BaseInfo: NextPage<Props> = ({
                                       data,
                                       setter,
                                       isLoading,
                                       errors = {
                                           title: false,
                                           description: false,
                                           price: false,
                                           base64MainImg: false,
                                           base64PreviewImg: false
                                       }
                                   }) => {

    const getErrorClassName = (flag: boolean): string => {
        return flag ? styles.eventError : '';
    }

    /**
     * Components
     */
    const availableCoinsSelector = () => {
        return (
            <Select disabled={isLoading}
                    defaultValue={baseCoin}
                    style={{width: 200}}
                    onChange={value => setter({...data, coin: value})
                    }>
                <Select.Option key={baseCoin} value={baseCoin}>{baseCoin}</Select.Option>
                {
                    possibleTokens.map(token => {
                            return (
                                <Select.Option key={token.symbol} value={token.symbol}>{token.symbol}</Select.Option>
                            );
                        }
                    )
                }
            </Select>
        );
    }

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        controlHeight: 64,
                        borderRadius: 20,
                        paddingSM: 24,
                        fontSize: 24,
                        fontFamily: 'CoHeadlineCorp',
                    }
                }}
            >
                <div className={styles.eventEditBaseInfoMainImageWrapper}>
                    <ImageUploader
                        disabled={isLoading}
                        description={"Add main picture"}
                        sizeText={"1100 x 450 px"}
                        hasError={errors.base64MainImg}
                        edited={true}
                        base64Img={data?.mainImage?.base64Image}
                        setBase64Img={img => setter({...data, mainImage: {id: undefined, base64Image: img}})}
                    />
                </div>

                <div className={styles.eventEditBaseInfoTitleWrapper}>
                    <div className={styles.eventEditBaseInfoLogoWrapper}>
                        <Image src={discordIcon} alt={"Community logo"} style={{borderRadius: "20px"}} fill/>
                    </div>

                    <Input
                        disabled={isLoading}
                        className={`${styles.eventEditBaseInfoTitle} ${getErrorClassName(errors.title)}`}
                        placeholder={"Add title"}
                        value={data.title}
                        onChange={e => setter({...data, title: e.target.value})}
                    />
                </div>

                <div className={styles.eventEditBaseInfoSecondWrapper}>
                    <div className={styles.eventEditBaseInfoPreviewImageWrapper}>
                        <ImageUploader
                            disabled={isLoading}
                            description={"Add main picture"}
                            sizeText={"350 x 450 px"}
                            hasError={errors.base64PreviewImg}
                            edited={true}
                            base64Img={data?.previewImage?.base64Image}
                            setBase64Img={img => setter({...data, previewImage: {id: undefined, base64Image: img}})}
                        />
                    </div>

                    <div className={styles.eventEditBaseInfoDescriptionWrapper}>
                        <div className={styles.eventEditBaseInfoPriceWrapper}>
                            <InputNumber
                                className={`${getErrorClassName(errors.price)}`}
                                disabled={isLoading}
                                style={{width: "100%"}}
                                type="number"
                                controls={false}
                                value={data.price}
                                min={0} max={Number.MAX_SAFE_INTEGER}
                                addonAfter={availableCoinsSelector()}
                                placeholder="Please enter a donation amount"
                                onChange={value => setter({...data, price: value ? value : 0.0})}
                            />
                        </div>

                        {/* todo don't use bold font here */}
                        <Input.TextArea
                            disabled={isLoading}
                            className={`${styles.eventEditBaseInfoDescription} ${getErrorClassName(errors.description)}`}
                            // can't move it to classname, because it doesn't work
                            style={{resize: "none", height: "100vh",}}
                            placeholder={"Add description"}
                            value={data.description}
                            onChange={e => setter({...data, description: e.target.value})}
                        />
                    </div>

                </div>
            </ConfigProvider>
        </>
    );
}

export default BaseInfo;