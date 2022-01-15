const getRightDistance = (distance) => {
    const distanceInMeters = distance;
    if (distanceInMeters < 1000) {
        return `${Math.floor(distanceInMeters)} м`;
    } else {
        return `${(distanceInMeters/1000).toFixed(3)} км`;
    }
};
export {getRightDistance}