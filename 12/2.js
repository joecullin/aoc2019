#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const sleep = require("../common/sleep");
const { printMap } = require("./printMap");

const maxSteps = 4686774924;
// const maxSteps = 10000;
const axes = ["x", "y", "z"];
let theMap = {};
let allPositions = [];
let step = 1;
let thisPosition;
let velocityChange;

const seenBucketSize = 100000; // max 100000000;
let seenBucketIndex = 0;
let seen = [new Uint8Array(seenBucketSize + 1)];
let seenKey = "";
let keyValues = [];

// Generate shorter (but still unique) array keys. Sort of like base-840 encoding.
// I only need to go one-way, so I took some shortcuts with chunks & ordering.
const alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_-+={[]}|/<,>.~`¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿̀́ͰͱͲͳʹ͵Ͷͷͺͻͼͽ;Ϳ΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿЀЁЂЃЄЅІЇЈ";
const toRange = alphabet.split("");
const toBase = toRange.length;
const fromRange = toRange.slice(0, 12);
const packKey = () => {
  seenKey = "";
  keyValues.forEach(val => {
    if (val < 0) {
      seenKey += "a";
      seenKey += Math.abs(val).toString();
    } else {
      seenKey += "b";
      seenKey += val.toString();
    }
  });

  let keyChunks = [];
  for (let i = 16; i < seenKey.length; i += 16) {
    keyChunks.push(seenKey.slice(i - 16, i));
  }
  keyChunks.push(seenKey.slice(seenKey.length - (16 - (seenKey.length % 16)))); // last fragment

  seenKey = "";
  keyChunks.forEach(chunk => {
    let decimal = 0;
    decimal = chunk.split("").reduce(function(acc, digit, index) {
      return (acc += fromRange.indexOf(digit) * Math.pow(12, index));
    }, 0);

    while (decimal > 0) {
      seenKey += toRange[decimal % toBase];
      decimal = (decimal - (decimal % toBase)) / toBase;
    }
  });
};

readLines().then(async input => {
  theMap = readMap({ input });
  let foundRepeat = false;

  while (step <= maxSteps && !foundRepeat) {
    allPositions = [
      theMap.map(moon => moon.position.x),
      theMap.map(moon => moon.position.y),
      theMap.map(moon => moon.position.z)
    ];

    // update velocities
    theMap.forEach((moon, moonIndex) => {
      axes.forEach((axis, axisIndex) => {
        thisPosition = allPositions[axisIndex][moonIndex];
        velocityChange = 0;
        allPositions[axisIndex]
          .filter((position, positionIndex) => positionIndex !== moonIndex)
          .forEach(otherMoonPosition => {
            if (otherMoonPosition !== thisPosition) {
              velocityChange += otherMoonPosition < thisPosition ? -1 : 1;
            }
          });
        theMap[moonIndex].velocity[axis] += velocityChange;
      });
    });

    // apply velocities
    theMap.forEach((moon, moonIndex) => {
      axes.forEach(axis => {
        theMap[moonIndex].position[axis] += theMap[moonIndex].velocity[axis];
      });
    });

    // generate unique key
    keyValues = [];
    theMap.forEach((moon, moonIndex) => {
      axes.forEach(axis => {
        keyValues.push(theMap[moonIndex].position[axis]);
        keyValues.push(theMap[moonIndex].velocity[axis]);
      });
    });
    packKey();

    // have we seen this state before?
    for (let i = 0; i < seenBucketIndex; i++) {
      if (seen[i][seenKey]) {
        logger.info(`repeated state at step #${step}!`);
        foundRepeat = true;
      }
    }

    if (step % seenBucketSize === 0) {
      seen.push(new Uint8Array(seenBucketSize + 1));
      seenBucketIndex++;
    }
    seen[seenBucketIndex][seenKey] = 1;

    if (step % 100000 === 0) {
      logger.debug(`step ${step} (` + step.toString().length + ` digits)`);
      // printMap({ mapData: theMap });
    }

    step++;
  }

  // logger.debug("seen contents", seen);

  logger.debug(
    `pausing at step ${step} (` + step.toString().length + ` digits)`
  );

  // await sleep(10 * 60 * 1000);
  logger.debug("done");
});
