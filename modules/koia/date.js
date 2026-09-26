var ferbezanMonths = [
          "Enere",
          "Febre",
          "Martus",
          "K\u02B7atorlune",
          "Ma",
          "Jon",
          "Juļjut",
          "Ogustut",
          "Novelune",
          "Dekelune",
          "Undekelune",
          "Duwodekelune",
          "Dakes Komplimentárjes",
        ];
        const getDayOfYear = (date = new Date()) =>
          Math.floor(
            (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
              Date.UTC(date.getFullYear(), 0, 0)) /
              (1000 * 60 * 60 * 24),
          );
        function getFerbezanMonth(n = getDayOfYear()) {
          var m = Math.floor((n - 1) / 30);
          return ferbezanMonths[m];
        }
        function getFerbezanDay(n = getDayOfYear()) {
          return ((n - 1) % 30) + 1;
        }

        class KoiaDate {
          constructor(year, month, day, format) {
            this.year = year;
            this.month = month;
            this.day = day;
            this.format = format;
            if (!year) {
              switch (format) {
                case "fq":
                  this.year = new Date().getFullYear() - 1790;
                  this.month = getFerbezanMonth();
                  this.day = getFerbezanDay();
                  break;
                case "ad":
                  this.year = new Date().getFullYear();
                  break;
                case "cq":
                  this.year = new Date().getFullYear() + 1047;
                  break;
              }
            }
          }

          toString(format) {
            var fqYear = this.format === "fq" ? this.year : this.year + 1790;
            var cqYear = this.format === "cq" ? this.year : this.year - 1047;
            var adYear = this.format === "ad" ? this.year : this.year - 236;
            if (format === "fq") {
              return `${this.month} ${this.day}, ${this.year}FQ`;
            } else if (format === "ad") {
              return `${this.month} ${this.day}, ${adYear}AD`;
            } else if (format === "cq") {
              return `${this.month} ${this.day}, ${cqYear}CQ`;
            }
          }
        }
        var yearOffset = {
          fq: -1790,
          ad: 0,
          cq: 1047,
        };
        function getCurrentDate(format) {
          const now = new Date();
          if (format === "fq") {
            return new KoiaDate(undefined, undefined, undefined, format);
          }
          const month = now.toLocaleString("default", { month: "long" });
          const day = now.getDate();
          const year = now.getFullYear() + yearOffset[format]; // Convert to FQ year
          return new KoiaDate(year, month, day, format);
        }
export {ferbezanMonths, getFerbezanMonth, getFerbezanDay, KoiaDate, getCurrentDate}
