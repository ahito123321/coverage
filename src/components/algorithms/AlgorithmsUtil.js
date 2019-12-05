/**
 * Функция проверки пересечения двух прямоугольников, 
 * которые описаны двумя точками
 * 
 * Структура принимаемого объекта 
 *  {
 *      id: 1,
 *      points: {
 *          topLeft: { 
 *              x: 0,
 *              y: 0
 *          },
 *          bottomRight: {
 *              x: 0,
 *              y: 0
 *          }
 *      }
 *  }
 *  
 * @param {Object} detail1 - Первая деталь описанная двумя точками 
 * @param {Object} detail2 - Вторая деталь описанная двумя точками
 * 
 * @returns логическое значение true/false
 */
const isCrossed = (detail1, detail2) => {

    let detail1Width = detail1.points.bottomRight.x - detail1.points.topLeft.x;
    let detail1Height = detail1.points.bottomRight.y - detail1.points.topLeft.y;

    let detail2Width = detail2.points.bottomRight.x - detail2.points.topLeft.x;
    let detail2Height = detail2.points.bottomRight.y - detail2.points.topLeft.y;

    let widthDiff = Math.max(detail1.points.bottomRight.x, detail2.points.bottomRight.x) -
        Math.min(detail1.points.topLeft.x, detail2.points.topLeft.x);
    let heightDiff = Math.max(detail1.points.bottomRight.y, detail2.points.bottomRight.y) -
        Math.min(detail1.points.topLeft.y, detail2.points.topLeft.y);

    return detail1Width + detail2Width > widthDiff &&
        detail1Height + detail2Height > heightDiff;
};

/**
 * Функция возвращает координаты верхней левой точки детали
 * относительно переданной левой нижней точки
 * 
 * @param {Object} leftBottomPoint - координаты левой нижней точки
 * @param {Object} sizes - размеры
 * 
 * @returns координаты верхней левой точки относительно переданной левой нижней и размеров детали
 */
const getTopLeftPointBySizeAndBottomLeftPoint = (leftBottomPoint, sizes) => {
    return {
        x: leftBottomPoint.x,
        y: leftBottomPoint.y - sizes.height
    };
};

/**
 * Функция возвращает координаты правой нижней точки детали
 * относительно переданной левой нижней точки 
 * 
 * @param {Object} leftBottomPoint - координаты левой нижней точки
 * @param {Object} sizes - размеры
 * 
 * @returns координаты правой нижней точки относительно переданной левой нижней и размеров детали
 */
const getBottomRightPointBySizeAndBottomLeftPoint = (leftBottomPoint, sizes) => {
    return {
        x: sizes.width + leftBottomPoint.x,
        y: leftBottomPoint.y
    };
};

/**
 * Функция проверяет возможность добавления детали на полотно к уже добавленным
 * деталям по ширине
 * 
 * @param {Array<Object>} details список деталей на полотне
 * @param {Array<Object>} verifiableDetailsOnWidth список деталей к которым можно добавить деталь с правой сторона 
 *                                                 относительно правой нижней точки
 * @param {Object} detail данные о новой детали, которую нужно добавить
 * @param {Object} canvas данные о полотне
 * 
 * @returns {Object} деталь к которой можно добавить
 */
const getSuitableDetailsForWidth = (details, verifiableDetailsOnWidth, detail, canvas) => {
    let suitableDetail;

    let sortedDetails = verifiableDetailsOnWidth.sort((a, b) => {
            if (a.points.bottomRight.y > b.points.bottomRight.y) return -1;
            if (a.points.bottomRight.y < b.points.bottomRight.y) return 1;
            return 0;
        }).sort((a, b) => {
            if (a.points.bottomRight.x < b.points.bottomRight.x) return -1;
            if (a.points.bottomRight.x > b.points.bottomRight.x) return 1;
            return 0;
        }).reverse();

    for (let index = 0; index < sortedDetails.length; index++) {
        let sortedDetail = sortedDetails[index];
        let tempDetail = {
            points: {
                topLeft: getTopLeftPointBySizeAndBottomLeftPoint(sortedDetail.points.bottomRight, detail),
                bottomRight: getBottomRightPointBySizeAndBottomLeftPoint(sortedDetail.points.bottomRight, detail)
            }
        };
        
        if (tempDetail.points.topLeft.y >= 0 && tempDetail.points.bottomRight.x <= canvas.width &&
            !details.some(detail => isCrossed(tempDetail, detail))) {
            suitableDetail = sortedDetail;
            break;
        }
    }

    return suitableDetail;
};

/**
 * Функция проверяет возможность добавления детали на полотно к уже добавленным
 * деталям по высоте
 * 
 * @param {Array<Object>} details список деталей на полотне
 * @param {Array<Object>} verifiableDetailsOnWidth список деталей к которым можно добавить деталь с правой сторона 
 *                                                 относительно правой нижней точки
 * @param {Object} detail данные о новой детали, которую нужно добавить
 * @param {Object} canvas данные о полотне
 * 
 * @returns {Array<Object} список деталей к которым можно добавить деталь
 */
const getSuitableDetailsForHeight = (details, verifiableDetailsOnHeight, detail, canvas) => {
    let suitableDetail;

    let sortedDetails = verifiableDetailsOnHeight.sort((a, b) => {
            if (a.points.topLeft.x > b.points.topLeft.x) return -1;
            if (a.points.topLeft.x < b.points.topLeft.x) return 1;
            return 0;
        })
        .sort((a, b) => {
            if (a.points.topLeft.y < b.points.topLeft.y) return -1;
            if (a.points.topLeft.y > b.points.topLeft.y) return 1;
            return 0;
        }).reverse();

    for (let index = 0; index < sortedDetails.length; index++) {
        let sortedDetail = sortedDetails[index];

        let tempDetail = {
            points: {
                topLeft: getTopLeftPointBySizeAndBottomLeftPoint(sortedDetail.points.topLeft, detail),
                bottomRight: getBottomRightPointBySizeAndBottomLeftPoint(sortedDetail.points.topLeft, detail)
            }
        };

        if (tempDetail.points.topLeft.y >= 0 && tempDetail.points.bottomRight.x <= canvas.width &&
            !details.some(detail => isCrossed(tempDetail, detail))) {
            suitableDetail = sortedDetail;
            break;
        }
    }
    if (detail.id === '2-1') console.log(suitableDetail);
    if (detail.id === '3-1') console.log(suitableDetail);
    if (detail.id === '4-1') console.log(suitableDetail);
    if (detail.id === '5-1') console.log(suitableDetail);
    return suitableDetail;
};

module.exports = {
    isCrossed,
    getTopLeftPointBySizeAndBottomLeftPoint,
    getBottomRightPointBySizeAndBottomLeftPoint,
    getSuitableDetailsForWidth,
    getSuitableDetailsForHeight
};