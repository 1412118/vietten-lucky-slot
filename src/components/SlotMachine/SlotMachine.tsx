import { useEffect, useState } from "react";
import { useSlotMachineStyles } from "./SlotMachine.style";

type SlotsType = {
  id: string;
  y: string;
  durationSeconds: number;
  items: {
    id: string;
    value: string;
  }[];
}[];

export const SlotMachine = () => {
  const styles = useSlotMachineStyles();

  const [slots, setSlots] = useState<SlotsType>([]);

  //   const [slotCount, setSlotCount] = useState<number>(6);
  //   const [itemCount, setItemCount] = useState<number>(64);
  const slotCount = 6;
  const itemCount = 64;

  const [spinning, setSpinning] = useState<boolean>(false);

  const getRandomItem = () => {
    return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"][
      Math.floor(Math.random() * 10)
    ];
  };

  const generateSlots = (
    slotCount: number,
    itemCount: number,
    slots: SlotsType = []
  ) => {
    const generatedSlots: SlotsType = [];

    for (let slot = 0; slot < slotCount; slot++) {
      generatedSlots.push({
        id: String(crypto.randomUUID()),
        y: `${itemCount * 17 - 4 * 4 - 1}rem`,
        durationSeconds: 0,
        items: [],
      });

      for (let item = 0; item < itemCount; item++) {
        const oldSlots = slots[slot]?.items;

        if (oldSlots && item < 3 && oldSlots.length >= 3) {
          generatedSlots[slot].items.push(oldSlots[oldSlots.length - 3 + item]);

          continue;
        }

        const randomItem = getRandomItem();

        generatedSlots[slot].items.push({
          id: String(crypto.randomUUID()),
          value: randomItem,
        });
      }
    }
    console.log("generatedSlots: ", generatedSlots);
    setSlots(generatedSlots);
  };

  const checkWin = () => {
    let previousSlot = slots[0];
    let win = true;
    console.log("previousSlot: ", previousSlot);
    console.log("slots: ", slots);
    slots.forEach((slot) => {
      //console.log(slot.items[itemCount - 1]);
      if (!win) return;

      if (
        slot.items[slot.items.length - 1].value !==
        previousSlot.items[previousSlot.items.length - 1].value
      ) {
        win = false;
      }

      previousSlot = slot;
    });

    if (win) {
      alert("Win");
    }
  };

  const spinReset = () => {
    slots.forEach((row) => {
      row.durationSeconds = 0;
    });

    //generateSlots(slotCount, itemCount, slots);

    setSpinning(false);
  };

  const spin = () => {
    setSpinning(true);

    let maxDuration = 0;
    // slots[0].items[15].value = "3";
    // slots[1].items[15].value = "2";
    // slots[2].items[15].value = "1";
    slots.forEach((row, index) => {
      row.y = "0";
      row.durationSeconds = 2 + index;

      if (row.durationSeconds > maxDuration) {
        maxDuration = row.durationSeconds;
      }
    });

    setSlots([...slots]);

    setTimeout(() => {
      checkWin();
      spinReset();
    }, maxDuration * 1000);
  };

  // generate initial slots
  useEffect(() => {
    generateSlots(slotCount, itemCount);
  }, []);

  useEffect(() => {
    generateSlots(slotCount, itemCount);
  }, [slotCount, itemCount]);

  return (
    <section css={styles.root}>
      <h1>VIETTEN IS LIFE</h1>
      {/* <span css={styles.subline}>
        Example by <a href="https://github.com/rex2go">@rex2go</a>
      </span> */}

      <div css={styles.rowsContainer}>
        {slots.map((slot) => (
          <div
            css={styles.slotsContainer}
            key={slot.id}
            style={{
              transform: `translateY(${slot.y})`,
              transitionDuration: `${slot.durationSeconds}s`,
            }}
          >
            {slot.items.map((item) => (
              <div key={item.id} css={styles.slotContainer}>
                <span className="item-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={() => !spinning && spin()}>Spin</button>

      {/* <div css={styles.settingsContainer}>
        <label>
          <span className="count">Slot Count ({slotCount})</span>
          <input
            type="range"
            min="2"
            max="9"
            value={slotCount}
            onChange={(event) =>
              !spinning && setSlotCount(parseInt(event.target.value))
            }
          ></input>
        </label>

        <label>
          <span className="count">Item Count ({itemCount})</span>
          <input
            type="range"
            min="16"
            max="256"
            value={itemCount}
            onChange={(event) =>
              !spinning && setItemCount(parseInt(event.target.value))
            }
          ></input>
        </label>
      </div> */}
    </section>
  );
};
