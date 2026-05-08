/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.SERVICES.CONCIERGE_SERVICE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = conciergeService.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/services/conciergeService.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Product } from "../types";

interface ConciergeFunctionCall {
  name: "select_artifact" | "navigate_to" | "compare_artifacts";
  args: Record<string, unknown>;
}

interface ConciergeResponse {
  text: string;
  functionCalls?: ConciergeFunctionCall[];
}

function findProductMatch(query: string, catalog: Product[] = []): Product | undefined {
  const normalized = query.toLowerCase();
  return catalog.find((product) => {
    return (
      normalized.includes(product.title.toLowerCase()) ||
      normalized.includes(product.sku.toLowerCase()) ||
      product.tags?.some((tag) => normalized.includes(tag.toLowerCase()))
    );
  });
}

function categoryMatches(query: string, catalog: Product[] = []): Product[] {
  const normalized = query.toLowerCase();
  return catalog
    .filter((product) => {
      return (
        normalized.includes(product.category.toLowerCase()) ||
        normalized.includes(product.metal.toLowerCase()) ||
        normalized.includes(product.diamondCut.toLowerCase()) ||
        normalized.includes(product.stoneType.toLowerCase())
      );
    })
    .slice(0, 4);
}

export async function getConciergeResponse(
  userQuery: string,
  currentProduct?: Product,
  catalog: Product[] = [],
): Promise<ConciergeResponse> {
  const normalized = userQuery.toLowerCase();

  if (normalized.includes("checkout") || normalized.includes("buy") || normalized.includes("purchase")) {
    return {
      text: "I can take you to the acquisition review. Please verify the selected pieces before final authorization.",
      functionCalls: [{ name: "navigate_to", args: { path: "/checkout" } }],
    };
  }

  if (normalized.includes("diamond") || normalized.includes("grading") || normalized.includes("guide")) {
    return {
      text: "Diamond quality is governed by cut, color, clarity, carat, certification, and source trace. I am opening the guide so you can review the standards before selecting a piece.",
      functionCalls: [{ name: "navigate_to", args: { path: "/diamonds" } }],
    };
  }

  const directMatch = findProductMatch(userQuery, catalog);
  if (directMatch) {
    return {
      text: `${directMatch.title} is a ${directMatch.metal} ${directMatch.category.toLowerCase()} with a ${directMatch.diamondCut} profile, ${directMatch.clarity} clarity, and ${directMatch.color} color grade. Its current registry value is $${directMatch.price.toLocaleString()}.`,
      functionCalls: [{ name: "select_artifact", args: { artifactId: directMatch.id } }],
    };
  }

  const matches = categoryMatches(userQuery, catalog);
  if (matches.length > 1) {
    return {
      text: `I found ${matches.length} relevant Campbell & Co. pieces worth comparing: ${matches.map((product) => product.title).join(", ")}.`,
      functionCalls: [{ name: "compare_artifacts", args: { artifactIds: matches.map((product) => product.id) } }],
    };
  }

  if (currentProduct) {
    return {
      text: `${currentProduct.title} carries the ${currentProduct.collection} profile: ${currentProduct.metal}, ${currentProduct.diamondCut} cut, ${currentProduct.carat}ct, and ${currentProduct.certification} certification. ${currentProduct.productStory}`,
    };
  }

  return {
    text: "I can help compare pieces, explain diamond grading, or guide you to the collection. Tell me the cut, metal, category, or occasion you are considering.",
  };
}
