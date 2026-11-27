import { useState } from "react";
import {
  Check,
  Coins,
  Heart,
  LockKeyhole,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { items, slots, slotLabels } from "../data/mock/adventureItems";
import type { AdventureItem, Slot } from "../data/mock/adventureItems";
import { Button } from "../components/ui";
import {
  AdventureHud,
  slotIcons,
  Sprite,
  useAdventureClock,
} from "../features/adventure/AdventureVisuals";
import { MAX_HEALTH, settleHealth } from "../features/adventure/engine";

function describe(item: AdventureItem) {
  switch (item.slot) {
    case "potion":
      return `Hồi ${item.effect} sinh mệnh, tối đa ${MAX_HEALTH}.`;
    case "shield":
      return `Đỡ đòn khi trả lời sai. Ở chặng thường, bỏ qua chặng và xem đáp án đúng. Ở chặng cuối, chỉ giữ sinh mệnh. Độ bền ${item.durability}.`;
    case "sword":
      return `Thêm ${item.effect}% vàng mỗi chặng. Độ bền ${item.durability}.`;
    case "pet":
      return "Đi cùng nhà thám hiểm trên bản đồ ải.";
  }
}

export default function Shop() {
  const { adventure, act, masteredTopics, notify } = useApp();
  const [slot, setSlot] = useState<Slot>("potion");
  const unlocked = masteredTopics.length;
  const { health } = settleHealth(adventure, useAdventureClock());

  return (
    <div className="container page-content adventure-shop">
      <div className="adventure-bar">
        <span>
          <ShoppingBag size={18} /> Kho tiếp tế
        </span>
        <AdventureHud />
      </div>
      <div className="page-heading">
        <h1>Cửa hàng phiêu lưu</h1>
        <p>
          Dùng vàng để mua vật phẩm, bảo dưỡng trang bị và chọn bạn đồng hành
          cho lần vào ải tiếp theo.
        </p>
      </div>
      <div className="shop-tabs" aria-label="Loại vật phẩm">
        {slots.map((id) => {
          const Icon = slotIcons[id];
          return (
            <Button
              key={id}
              variant={slot === id ? "primary" : "secondary"}
              aria-pressed={slot === id}
              onClick={() => setSlot(id)}
            >
              <Icon size={18} />
              {slotLabels[id]}
            </Button>
          );
        })}
      </div>
      {slot === "potion" && (
        <p>
          Dùng thuốc tại đây để hồi sinh mệnh, hoặc trang bị cho lượt sau. Trong
          ải, thuốc đã trang bị tự dùng một lần khi sinh mệnh về 0.
        </p>
      )}
      <div className="shop-grid">
        {items
          .filter((item) => item.slot === slot)
          .map((item) => {
            const value = adventure.inventory[item.id];
            const owned =
              slot === "potion" ? (value ?? 0) > 0 : value !== undefined;
            const equipped = owned && adventure.loadout[slot] === item.id;
            const locked = item.unlockedAt > unlocked;
            const Icon = slotIcons[slot];
            const transact = (type: "buy" | "equip" | "repair") => {
              act({ type, itemId: item.id, unlocked });
              notify(
                type === "buy"
                  ? `Đã mua ${item.name}.`
                  : type === "repair"
                    ? `Đã bảo dưỡng ${item.name}.`
                    : equipped
                      ? `Đã bỏ trang bị ${item.name}.`
                      : `Đã trang bị ${item.name}.`,
              );
            };
            return (
              <article key={item.id} className="shop-item card">
                <div className="shop-item-art">
                  {slot === "pet" ? (
                    <Sprite id={item.id} />
                  ) : (
                    <Icon size={32} />
                  )}
                </div>
                <div className="shop-item-details">
                  <span className="shop-rarity">{item.rarity}</span>
                  <h2>{item.name}</h2>
                  <p>{describe(item)}</p>
                  {owned && (
                    <small>
                      {slot === "potion"
                        ? `Trong túi: ${value}`
                        : item.durability
                          ? `Độ bền: ${value}/${item.durability}`
                          : "Đã sở hữu"}
                    </small>
                  )}
                  {locked && (
                    <small className="item-lock">
                      <LockKeyhole size={14} /> Hoàn thành {item.unlockedAt} chủ
                      đề để mua
                    </small>
                  )}
                </div>
                <div className="shop-item-actions">
                  {slot === "potion" && owned && (
                    <Button
                      disabled={health === MAX_HEALTH}
                      onClick={() => {
                        act({ type: "drink", itemId: item.id });
                        notify(`Đã dùng ${item.name}.`);
                      }}
                    >
                      <Heart size={16} /> Dùng ngay
                    </Button>
                  )}
                  {(!owned || slot === "potion") && (
                    <Button
                      variant={owned ? "secondary" : "primary"}
                      disabled={locked || adventure.coins < item.price}
                      onClick={() => transact("buy")}
                    >
                      <Coins size={16} /> Mua · {item.price} vàng
                    </Button>
                  )}
                  {owned && (
                    <Button
                      variant={equipped ? "secondary" : "primary"}
                      aria-pressed={equipped}
                      onClick={() => transact("equip")}
                    >
                      {equipped ? (
                        <>
                          <Check size={16} /> Đang trang bị · Gỡ
                        </>
                      ) : (
                        "Trang bị"
                      )}
                    </Button>
                  )}
                  {owned &&
                    item.repair &&
                    item.durability &&
                    value < item.durability && (
                      <Button
                        variant="secondary"
                        disabled={adventure.coins < item.repair}
                        onClick={() => transact("repair")}
                      >
                        <Wrench size={16} /> Bảo dưỡng · {item.repair} vàng
                      </Button>
                    )}
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
