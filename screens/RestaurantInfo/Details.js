import React, {useRef, useContext, useState} from 'react';
import {View} from 'react-native';
import {BoldText, normalizedFontSize, RText} from '../../GlobeStyle';
import {capitalizeFirstLetter} from '../../components/Helpers';
import Storetag from './Tag';

const Details = ({style, categories, estimatedCost, paymentMethods, tags}) => {
  let paymentMethodsText;

  if (paymentMethods && paymentMethods.length > 0) {
    paymentMethodsText =
      paymentMethods.length > 1
        ? 'Cash and Card accepted'
        : 'Cash accepted only';
  }

  return (
    <View style={style.restDetailsContainerOuter}>
      <View style={style.restDetailsContainerInner}>
        <BoldText style={{fontSize: normalizedFontSize(7)}}>DETAILS</BoldText>
        <RText style={style.restDetailSubtext}>CUISINES</RText>
        <View style={style.restDetailsCategories}>
          <RText style={style.restDetailsCategory}>{categories}</RText>
        </View>
        <RText
          style={{
            ...style.restDetailSubtext,
            paddingTop: 15,
            paddingBottom: 10,
          }}>
          AVERAGE COST
        </RText>
        {estimatedCost ? (
          <React.Fragment>
            <RText style={style.restDetailEstimatedCost}>
              {estimatedCost.cost} KD for {estimatedCost.customerInteger} people
              (approx).
            </RText>
            <RText style={style.restDetailSubtext}>
              Exclusive of applicable taxes and charges, if any
            </RText>
            {paymentMethodsText ? (
              <RText style={{...style.restDetailEstimatedCost, paddingTop: 15}}>
                {paymentMethodsText}
              </RText>
            ) : (
              ''
            )}
          </React.Fragment>
        ) : null}
        {tags && tags.length > 0 ? (
          <>
            <RText
              style={{
                ...style.restDetailSubtext,
                ...style.restDetailSubtextOtherTags,
              }}>
              OTHER TAGS
            </RText>
            <View
              style={{
                ...style.reviewHighlightsTagsContainer,
                ...style.restOtherTagsContainer,
              }}>
              {tags.map((tag) => (
                <Storetag
                  text={tag}
                  key={tag}
                  tagContainer={{
                    ...style.tagContainer,
                    ...style.restOtherTagContainer,
                  }}
                  tagText={style.restOtherTagsext}
                />
              ))}
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default Details;
