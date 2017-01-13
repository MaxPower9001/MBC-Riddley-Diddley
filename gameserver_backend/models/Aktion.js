/**
 * Created by kk on 04.12.16.
 */
const Aktion = {
    LINKSKNOPF: 1,
    RECHTSKNOPF: 2,
    SCHUETTELN: 3,
};

exports.getZufallsAktion = function () {
    var keys = Object.keys(Aktion)
    return Aktion[keys[ keys.length * Math.random() << 0]];
};