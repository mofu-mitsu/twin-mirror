const TypologyConverter = {
    // MBTI: 後ろに -A や -T などがついていても、一番後ろにあるJとPだけを入れ替える
    mbti: (val) => {
        if(!val) return '';
        return val.replace(/([JPjp])([^JPjp]*)$/, (match, p1, p2) => {
            const isLower = p1 === p1.toLowerCase();
            const flipped = p1.toUpperCase() === 'J' ? 'P' : 'J';
            return (isLower ? flipped.toLowerCase() : flipped) + p2;
        });
    },

    // エニアグラム: コアを維持し、もう片方のウィングに入れ替える (例: 5w6 ↔ 5w4)
    enneagram: (val) => {
        if(!val) return '';
        const match = val.match(/^(\d)\s*w\s*(\d)(.*)$/i);
        if(match) {
            const core = parseInt(match[1]);
            const wing = parseInt(match[2]);
            const rest = match[3]; 
            let newWing = (core - 1) === wing || (core === 1 && wing === 9) ? (core + 1) : (core - 1);
            if (newWing === 10) newWing = 1;
            if (newWing === 0) newWing = 9;
            return `${core}w${newWing}${rest}`;
        }
        return val;
    },

    // ソシオニクス: 準同一関係 (Quasi-Identical) に変換 (LII-Neなどのサブタイプ対応)
    socionics: (val) => {
        if(!val) return '';
        const map = {
            'ILE':'LIE', 'LIE':'ILE',
            'SEI':'ESI', 'ESI':'SEI',
            'ESE':'SEE', 'SEE':'ESE',
            'LII':'ILI', 'ILI':'LII',
            'EIE':'IEE', 'IEE':'EIE',
            'LSI':'SLI', 'SLI':'LSI',
            'SLE':'LSE', 'LSE':'SLE',
            'IEI':'EII', 'EII':'IEI'
        };
        return val.replace(/^([a-zA-Z]{3})(.*)$/, (match, p1, p2) => {
            const up = p1.toUpperCase();
            if (map[up]) {
                const isLower = p1 === p1.toLowerCase();
                const flipped = map[up];
                return (isLower ? flipped.toLowerCase() : flipped) + p2;
            }
            return match;
        });
    },

    // トライタイプ: 1文字目は固定。2,3文字目を完全対称(ペア)で入れ替え、各センター(234, 567, 891)をはみ出さない
    tritype: (val) => {
        if(!val) return '';
        // 相互変換のための固定ペア (これなら絶対にA↔Bの対になる)
        // Gut: 1↔9 (8は8のまま)
        // Heart: 3↔4 (2は2のまま)
        // Head: 5↔6 (7は7のまま)
        const symMap = {
            '1':'9', '9':'1', '8':'8',
            '2':'2', '3':'4', '4':'3',
            '5':'6', '6':'5', '7':'7'
        };
        let cleanVal = val.replace(/[^0-9]/g, '');
        if(cleanVal.length >= 3) {
            let res = cleanVal[0] + (symMap[cleanVal[1]] || cleanVal[1]) + (symMap[cleanVal[2]] || cleanVal[2]);
            return val.replace(cleanVal.substring(0,3), res);
        }
        return val;
    },

    // 生得本能: サブ(2番目)を固定し、メイン(1番目)を「残りの1つ(盲点)」に入れ替える (例: sp/so ↔ sx/so)
    instinct: (val) => {
        if(!val) return '';
        return val.replace(/(sp|sx|so)([\s\/]*)(sp|sx|so)(.*)/i, (match, p1, p2, p3, p4) => {
            const first = p1.toLowerCase();
            const second = p3.toLowerCase();
            const instincts = ['sp', 'sx', 'so'];
            
            // 1番目と2番目で使われていない「第3の本能（盲点）」を探す
            const third = instincts.find(i => i !== first && i !== second);
            
            if (third) {
                const isUpper = p1 === p1.toUpperCase();
                const newFirst = isUpper ? third.toUpperCase() : third;
                return newFirst + p2 + p3 + p4;
            }
            return match;
        });
    },

    // DCNH: D↔C, N↔H 完全入れ替え (例: NC ↔ HD)
    dcnh: (val) => {
        if(!val) return '';
        const map = {'D':'C', 'C':'D', 'N':'H', 'H':'N', 'd':'c', 'c':'d', 'n':'h', 'h':'n'};
        return val.split('').map(c => map[c] || c).join('');
    },

    // サイコソフィア: 3文字目と4文字目を完全入れ替え (例: LVFE ↔ LVEF)
    psychosophy: (val) => {
        if(!val) return '';
        let c = val.trim();
        if(c.length >= 4) {
            return c.substring(0,2) + c[3] + c[2] + c.substring(4);
        }
        return val;
    },

    // アマトリカ: 3文字目と4文字目を完全入れ替え (例: PSEA ↔ PSAE)
    amatorica: (val) => {
        if(!val) return '';
        let c = val.trim();
        if(c.length >= 4) {
            return c.substring(0,2) + c[3] + c[2] + c.substring(4);
        }
        return val;
    }
};
