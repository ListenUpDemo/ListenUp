import { useState } from "react";
import { Link } from "react-router-dom";
import { lessons } from "../data/mock/lessons";
import {
  Check,
  Coins,
  Sandwich,
  LockKeyhole,
  ShoppingBag,
  RotateCcw,
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
      return `Hồi ${item.effect} năng lượng, tối đa ${MAX_HEALTH}.`;
    case "shield":
      return `${item.durability} lượt tra. Khi trả lời sai, tự dùng một lượt để giữ năng lượng. Câu thường được xem đáp án và đi tiếp. Câu cuối cần thử lại.`;
    case "sword":
      return `${item.durability} lượt ghi. Thêm ${item.effect}% vàng mỗi câu được tính thưởng và lưu cụm phát âm của bài vào sổ tay.`;
    case "pet":
      return "Đồng hành cùng bạn trong các buổi luyện.";
  }
}

export default function Shop() {
  const { adventure, act, masteredTopics, notify } = useApp();
  const [slot, setSlot] = useState<Slot>("potion");
  const unlocked = masteredTopics.length;
  const notebook = lessons.filter((lesson) =>
    adventure.notebookLessonIds?.includes(lesson.id),
  );
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
        <h1>Cửa hàng</h1>
        <p>
          Dùng vàng mua đồ ăn, nạp lượt cho dụng cụ học và chọn bạn đồng hành.
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
          Dùng đồ ăn tại đây để hồi năng lượng hoặc mang theo cho lượt sau. Đồ
          ăn mang theo tự dùng một lần khi năng lượng về 0.
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
                    ? `Đã nạp lượt dùng cho ${item.name}.`
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
                          ? `${value}/${item.durability} lượt còn lại`
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
                      <Sandwich size={16} /> Ăn ngay
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
                        <RotateCcw size={16} /> Nạp lượt · {item.repair} vàng
                      </Button>
                    )}
                </div>
              </article>
            );
          })}
      </div>
      {slot === "sword" && (
        <section className="card notebook-panel">
          <h2>Cụm từ đã lưu</h2>
          {notebook.length ? (
            <ul>
              {notebook.map(({ id, slug, pronunciation }) => (
                <li key={id}>
                  <Link className="text-link" to={`/lessons/${slug}`}>
                    <span lang="en-US">{pronunciation?.phrase}</span>{" "}
                    {pronunciation?.ipa}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Mang theo sổ tay khi luyện để lưu cụm phát âm của bài.</p>
          )}
        </section>
      )}
    </div>
  );
}
