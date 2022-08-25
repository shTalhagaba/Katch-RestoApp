import React, { useEffect, useState } from 'react';

const toRad = (/** @type {number} */ angle) => {
  return (angle * Math.PI) / 180;
};

// Get the distance between two latitude and longitude
const computeDistance = (
  [sourcelatitude, sourceLongitude],
  [destinationLatitude, destinationLongitude],
) => {
  const prevLatInRad = toRad(sourcelatitude);
  const prevLongInRad = toRad(sourceLongitude);
  const latInRad = toRad(destinationLatitude);
  const longInRad = toRad(destinationLongitude);

  return (
    // In kilometers
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) *
          Math.cos(latInRad) *
          Math.cos(longInRad - prevLongInRad),
    )
  );
};

const DistanceCard = (props) => {
  const {
    source,
    destination,
    distanceLimit = 30,
    validDistance,
    userDistance,
  } = props;
  const [canBeDelivered, setCanBeDelivered] = useState(null);
  const [userDistanceState, setUserDistanceState] = useState(null);

  useEffect(() => {
    if (source && destination) {
      const distance = computeDistance(
        [source.latitude, source.longitude],
        [destination.latitude, destination.longitude],
      );
      const deliverable = distance < distanceLimit;
      setUserDistanceState(distance);
      setCanBeDelivered(deliverable);
    }
  }, [destination, source, distanceLimit]);

  useEffect(() => {
    validDistance(canBeDelivered);
    userDistance(userDistanceState);
  }, [canBeDelivered, validDistance, userDistanceState, userDistance]);

  return <></>;
};

export default DistanceCard;
